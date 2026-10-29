# Blog CMS (`cms.nwdagency.com`)

WordPress is the CMS for `nwdagency.com/blog`. It runs on the same Hetzner server as the
Next.js site and has no public front end of its own: visiting a post or the home page on
`cms.nwdagency.com` redirects to `nwdagency.com/blog`.

```text
editor ──► cms.nwdagency.com/wp-admin   (Cloudflare Access, then WordPress login)
visitor ──► nwdagency.com/blog ──► Next.js ──► WordPress REST API on 127.0.0.1:8081
publish in WordPress ──► POST 127.0.0.1:3000/api/revalidate ──► Next.js refreshes its blog cache
```

Next.js keeps WordPress responses in its cache. When content changes, WordPress calls
`/api/revalidate` with the changed posts' slugs; Next.js marks the cache stale and reloads `/blog`
and those posts right away, so changes show within a second or two. If WordPress is down, the
blog keeps serving the last cached version instead of failing. Without a webhook the cache
refreshes hourly.

## Server

| What | Where |
| --- | --- |
| WordPress | `/var/www/cms/public` (owner `cms`), `wp-config.php` one level up |
| PHP-FPM pool | `/etc/php/8.3/fpm/pool.d/cms.conf` (from `ops/wordpress/php-fpm-cms.conf`) |
| nginx | `/etc/nginx/sites-available/cms.nwdagency.com` + `snippets/cms-wordpress.conf` (from `ops/nginx/`) |
| Database | MariaDB `nwd_cms`, nightly dump to `/var/backups/cms` (7 days) |
| Must-use plugin | `wp-content/mu-plugins/nwd-headless.php` (from `ops/wordpress/mu-plugins/`) |
| Cron | `/etc/cron.d/cms-wordpress` (wp-cron every 5 minutes, db dump at 03:15) |
| Next.js env | `WORDPRESS_API_URL`, `REVALIDATE_SECRET` in `shared/.env.production` |

Install once with `ops/wordpress/install.sh` (see the header of the script).
After changing `nwd-headless.php`, copy it to the server:

```bash
ssh nwd 'install -o cms -g cms -m 644 /var/www/newdirection/current/ops/wordpress/mu-plugins/nwd-headless.php /var/www/cms/public/wp-content/mu-plugins/'
```

WP-CLI runs as the `cms` user:

```bash
ssh nwd 'sudo -u cms -H wp --path=/var/www/cms/public plugin list'
```

## Cloudflare

- DNS: `CNAME cms → nwdagency.com`, proxied. The origin certificate already covers `*.nwdagency.com`.
- Zero Trust → Access → Applications: a self-hosted app for `cms.nwdagency.com/wp-admin` and
  `cms.nwdagency.com/wp-login.php`, allowing only the editors' emails (one-time PIN).
  The REST API and `/wp-content/uploads` stay public; the blog reads them.

## Writing a post

| On the site | In WordPress |
| --- | --- |
| Label above the image (`NWD STORIES`) and the section on `/blog` | Category: NWD Stories, Reflections or Leadership compass |
| Large image at the top, card image | Featured image |
| Serif italic words in the title | Wrap them in `<em>…</em>` in the title, e.g. `Designing for a <em>World in</em> Motion` |
| Grey text under the title (post page), text on the cards | Excerpt. The post page shows only a hand-written excerpt; cards fall back to the start of the text |
| Orange serif paragraph with a short line above | Paragraph block → Styles → **Intro** |
| Images side by side, full-width image | Gallery block; Image block with alignment **Full width** |
| CREDITS | Credits box in the sidebar, one name per line |
| TAGS | Tags |
| Big story at the top of `/blog` | Post settings → **Stick to the top of the blog** (otherwise the newest NWD Story) |

Published changes show on the site within a few seconds. Scheduled posts go live within 5 minutes of their time.

## Local development

Point the local site at the live REST API (read only) in `.env.local`:

```env
WORDPRESS_API_URL=https://cms.nwdagency.com/wp-json
```

`REVALIDATE_SECRET` is only needed to test `/api/revalidate` locally.
