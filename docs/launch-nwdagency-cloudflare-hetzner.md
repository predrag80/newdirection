# Launch `nwdagency.com` on Cloudflare + Hetzner

This project is a Next.js server app because the contact form uses `/api/contact`.
Do not deploy it as a static `out/` folder.

## 1. Deploy app to Hetzner

Every push to `main` deploys through `.github/workflows/deploy.yml`:
typecheck, lint and `next build` run on GitHub, the build is uploaded to a new release
folder and `ops/deploy/activate.sh` switches to it. A failed check stops the deploy;
a failed health check after the switch rolls back to the previous release.
Run it by hand from the Actions tab with **Deploy → Run workflow**.

Server layout:

```text
/var/www/newdirection/
  releases/<timestamp>-<sha>/   last 5 deploys
  shared/.env.production        secrets, symlinked into each release
  current -> releases/...       PM2 cwd (ecosystem.config.cjs)
```

GitHub repo settings (Settings → Secrets and variables → Actions):

| Name | Kind | Value |
| --- | --- | --- |
| `SSH_HOST` | secret | server IP |
| `SSH_PRIVATE_KEY` | secret | private part of the `github-actions-deploy@newdirection` key |
| `SSH_KNOWN_HOSTS` | secret | `ssh-keyscan` line(s) for the server |
| `APP_URL` | variable | `https://nwdagency.com` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | variable | Turnstile site key (public, inlined at build) |

Roll back by hand:

```bash
cd /var/www/newdirection
ls releases
ln -sfn /var/www/newdirection/releases/<id> current.tmp && mv -Tf current.tmp current
pm2 startOrReload current/ecosystem.config.cjs --update-env
```

Server `shared/.env.production`:

```env
APP_URL=https://nwdagency.com
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM="NWD Agency <noreply@nwdagency.com>"
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
```

## 2. Install Nginx vhost

Create a Cloudflare Origin Certificate for `nwdagency.com` and `*.nwdagency.com`.
Store it on the server:

```bash
sudo mkdir -p /etc/ssl/cloudflare
sudo nano /etc/ssl/cloudflare/nwdagency.com.pem
sudo nano /etc/ssl/cloudflare/nwdagency.com.key
sudo chmod 600 /etc/ssl/cloudflare/nwdagency.com.key
```

Install the Nginx config:

```bash
sudo cp /var/www/newdirection/ops/nginx/nwdagency.com.conf /etc/nginx/sites-available/nwdagency.com
sudo ln -sfn /etc/nginx/sites-available/nwdagency.com /etc/nginx/sites-enabled/nwdagency.com
sudo nginx -t
sudo systemctl reload nginx
```

Hetzner firewall must allow inbound TCP `80` and `443`.

## 3. Cloudflare DNS

Add `nwdagency.com` to Cloudflare and create these web records:

```text
Type   Name   Content           Proxy
A      @      <SERVER_IP>       Proxied
CNAME  www    nwdagency.com     Proxied
```

Set SSL/TLS mode to `Full (strict)` after the origin certificate is installed.
Enable `Always Use HTTPS`.

## 4. Loopia nameservers

Before changing nameservers, copy existing email DNS records from Loopia into Cloudflare.
Then set the two Cloudflare nameservers in the Loopia domain panel.

If DNSSEC is enabled in Loopia, disable it before changing nameservers.

Verify:

```bash
dig NS nwdagency.com
dig A nwdagency.com
dig CNAME www.nwdagency.com
```

## 5. Email DNS

Inbound email for `office@nwdagency.com` must keep its existing provider records.
Copy all current Loopia mail records into Cloudflare before nameserver switch:

- `MX`
- root SPF `TXT`
- DKIM `TXT` or `CNAME`
- DMARC `TXT`
- `mail`, `webmail`, `autodiscover`, or provider-specific records

Mail-related records must be `DNS only`, not proxied.

For Mailtrap production sending, verify `nwdagency.com` in Mailtrap and add the exact DNS records Mailtrap provides.
If a root SPF record already exists, merge Mailtrap into the existing SPF instead of creating a second SPF record.

Initial DMARC if none exists:

```text
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:office@nwdagency.com
Proxy: DNS only
```

## 6. Final checks

Local:

```bash
npm run check
```

Server:

```bash
curl -I http://127.0.0.1:3000
curl -I https://nwdagency.com
curl -I https://www.nwdagency.com
pm2 status
pm2 logs newdirection
sudo nginx -t
```

Functional checks:

- `https://nwdagency.com` loads.
- `https://www.nwdagency.com` redirects to `https://nwdagency.com`.
- Images and videos load.
- Contact form sends to `office@nwdagency.com`.
- Shared link preview uses `/opengraph-image`.
