#!/usr/bin/env bash
# One-time install of WordPress as the CMS for nwdagency.com/blog, on cms.nwdagency.com.
# Run on the server as root, after a deploy has put this file in the current release:
#   ADMIN_EMAIL=you@example.com bash /var/www/newdirection/current/ops/wordpress/install.sh
#
# Generated passwords go to /root/cms-credentials.txt (root only), never to the terminal.
#
# To retry after a failed run, remove the partial install first:
#   systemctl stop php8.3-fpm
#   mariadb -e "DROP DATABASE IF EXISTS nwd_cms; DROP USER IF EXISTS 'nwd_cms'@'localhost';"
#   rm -rf /var/www/cms /etc/php/8.3/fpm/pool.d/cms.conf /etc/cron.d/cms-wordpress
#   userdel cms
set -euo pipefail
trap 'echo "FAILED at line $LINENO" >&2' ERR

ADMIN_EMAIL="${ADMIN_EMAIL:?set ADMIN_EMAIL}"
ADMIN_USER="${ADMIN_USER:-predrag}"
REPO=/var/www/newdirection/current
CMS=/var/www/cms
DB=nwd_cms
NEXT_ENV=/var/www/newdirection/shared/.env.production
CREDS=/root/cms-credentials.txt

# From inside $CMS: some WP-CLI commands start subprocesses in the current directory,
# which fails when that is a directory the cms user cannot enter (e.g. /root).
wp() { (cd "$CMS" && sudo -u cms -H /usr/local/bin/wp --path="$CMS/public" "$@"); }

[ -e "$CMS" ] && { echo "$CMS already exists, aborting"; exit 1; }

echo "== packages"
apt-get update -q
DEBIAN_FRONTEND=noninteractive apt-get install -yq \
  mariadb-server php8.3-fpm php8.3-mysql php8.3-xml php8.3-mbstring php8.3-curl \
  php8.3-gd php8.3-intl php8.3-zip unzip
systemctl enable --now mariadb

echo "== wp-cli"
curl -fsSL -o /tmp/wp-cli.phar https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
curl -fsSL -o /tmp/wp-cli.phar.sha512 https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar.sha512
echo "$(cat /tmp/wp-cli.phar.sha512)  /tmp/wp-cli.phar" | sha512sum -c -
install -m 755 /tmp/wp-cli.phar /usr/local/bin/wp
rm -f /tmp/wp-cli.phar /tmp/wp-cli.phar.sha512

echo "== system user and php-fpm pool"
useradd --system --home-dir "$CMS" --shell /usr/sbin/nologin cms
install -d -o cms -g cms -m 711 "$CMS"
install -d -o cms -g cms -m 755 "$CMS/public"
install -m 644 "$REPO/ops/wordpress/php-fpm-cms.conf" /etc/php/8.3/fpm/pool.d/cms.conf
[ -f /etc/php/8.3/fpm/pool.d/www.conf ] && mv /etc/php/8.3/fpm/pool.d/www.conf /etc/php/8.3/fpm/pool.d/www.conf.disabled
php-fpm8.3 -t
systemctl restart php8.3-fpm

echo "== database"
DB_PASS="$(openssl rand -hex 24)"
mariadb <<SQL
CREATE DATABASE $DB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER '$DB'@'localhost' IDENTIFIED BY '$DB_PASS';
GRANT ALL PRIVILEGES ON $DB.* TO '$DB'@'localhost';
SQL

echo "== wordpress"
ADMIN_PASS="$(openssl rand -base64 18)"
REVALIDATE_SECRET="$(openssl rand -hex 32)"
wp core download --locale=en_US
wp config create --dbname="$DB" --dbuser="$DB" --dbpass="$DB_PASS" --dbhost=localhost --skip-check --extra-php <<PHP
define('WP_HOME', 'https://cms.nwdagency.com');
define('WP_SITEURL', 'https://cms.nwdagency.com');
define('FORCE_SSL_ADMIN', true);
define('DISALLOW_FILE_EDIT', true);
define('DISABLE_WP_CRON', true);
define('WP_POST_REVISIONS', 20);
define('NWD_REVALIDATE_URL', 'http://127.0.0.1:3000/api/revalidate');
define('NWD_REVALIDATE_SECRET', '$REVALIDATE_SECRET');
PHP
# wp-config.php one level above the web root, readable only by the cms user.
mv "$CMS/public/wp-config.php" "$CMS/wp-config.php"
chmod 600 "$CMS/wp-config.php"

wp core install --url=https://cms.nwdagency.com --title="NWD CMS" \
  --admin_user="$ADMIN_USER" --admin_email="$ADMIN_EMAIL" --admin_password="$ADMIN_PASS" --skip-email
wp rewrite structure '/%postname%/'
wp option update timezone_string Europe/Belgrade
wp option update blog_public 0
wp option update default_comment_status closed
wp option update default_ping_status closed

NWD_STORIES_ID="$(wp term create category 'NWD Stories' --slug=nwd-stories --porcelain)"
wp term create category 'Reflections' --slug=reflections
wp term create category 'Leadership compass' --slug=leadership-compass
wp option update default_category "$NWD_STORIES_ID"
wp term delete category 1

wp post delete $(wp post list --post_type=post,page --post_status=any --format=ids) --force
wp plugin delete akismet hello || true
wp theme delete --all || true

install -d -o cms -g cms -m 755 "$CMS/public/wp-content/mu-plugins"
install -o cms -g cms -m 644 "$REPO/ops/wordpress/mu-plugins/nwd-headless.php" "$CMS/public/wp-content/mu-plugins/"

echo "== cron (wp-cron and nightly db dump, 7 days)"
install -d -m 700 /var/backups/cms
cat > /etc/cron.d/cms-wordpress <<'CRON'
*/5 * * * * cms /usr/local/bin/wp --path=/var/www/cms/public cron event run --due-now --quiet
15 3 * * * root mariadb-dump --single-transaction nwd_cms | gzip > /var/backups/cms/nwd_cms-$(date +\%a).sql.gz
CRON

echo "== nginx"
install -m 644 "$REPO/ops/nginx/snippets/cms-wordpress.conf" /etc/nginx/snippets/cms-wordpress.conf
install -m 644 "$REPO/ops/nginx/cms.nwdagency.com.conf" /etc/nginx/sites-available/cms.nwdagency.com
ln -sfn /etc/nginx/sites-available/cms.nwdagency.com /etc/nginx/sites-enabled/cms.nwdagency.com
if ! nginx -t; then
  rm -f /etc/nginx/sites-enabled/cms.nwdagency.com
  echo "nginx -t failed, cms site disabled" >&2
  exit 1
fi
systemctl reload nginx

echo "== Next.js env"
grep -q '^WORDPRESS_API_URL=' "$NEXT_ENV" || echo 'WORDPRESS_API_URL=http://127.0.0.1:8081/wp-json' >> "$NEXT_ENV"
grep -q '^REVALIDATE_SECRET=' "$NEXT_ENV" || echo "REVALIDATE_SECRET=$REVALIDATE_SECRET" >> "$NEXT_ENV"

(umask 077; cat > "$CREDS" <<CREDS
WordPress admin: https://cms.nwdagency.com/wp-admin
  user:     $ADMIN_USER
  password: $ADMIN_PASS
Database $DB (user $DB): $DB_PASS
Save these in a password manager, then: rm $CREDS
CREDS
)

echo "== check"
curl -fsS http://127.0.0.1:8081/wp-json/wp/v2/categories | python3 -c 'import sys,json; print("categories:", [c["name"] for c in json.load(sys.stdin)])'
curl -sk -o /dev/null -w "wp-login.php: %{http_code}\n" --resolve cms.nwdagency.com:443:127.0.0.1 https://cms.nwdagency.com/wp-login.php
echo "Done. Credentials: $CREDS"
