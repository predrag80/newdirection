# Launch `nwdagency.com` on Cloudflare + Hetzner

This project is a Next.js server app because the contact form uses `/api/contact`.
Do not deploy it as a static `out/` folder.

## 1. Deploy app to Hetzner

Sync the project source to the server:

```bash
rsync -avz --delete \
  --exclude node_modules \
  --exclude .next \
  --exclude .git \
  --exclude .env.local \
  ./ root@<SERVER_IP>:/var/www/newdirection/
```

On the server:

```bash
cd /var/www/newdirection
npm install
npm run build
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

If the PM2 app already exists:

```bash
cd /var/www/newdirection
npm install
npm run build
pm2 restart newdirection
pm2 save
```

Server `.env.local`:

```env
APP_URL=https://nwdagency.com
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM="NWD Agency <noreply@nwdagency.com>"
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
