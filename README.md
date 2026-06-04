# New Direction

Static Next.js site for a landing page with project links and single-view project sections.

## Local development

```bash
npm install
npm run dev
```

Open `http://newdirection.local:3000` or `http://localhost:3000`.

## Static build

```bash
npm run build
```

Next.js exports the static site to `out/`. The local Nginx virtual host should use:

```nginx
root /var/www/html/newdirection/out;
```

After every content or code change, run `npm run build` to refresh the files served by Nginx.

## Local Nginx vhost

The versioned config lives in `ops/nginx/newdirection.local.conf`.

Install or update it on WSL:

```bash
sudo cp ops/nginx/newdirection.local.conf /etc/nginx/sites-available/newdirection.local
sudo ln -sfn /etc/nginx/sites-available/newdirection.local /etc/nginx/sites-enabled/newdirection.local
sudo nginx -t
sudo service nginx reload
```

Make sure `/etc/hosts` contains:

```text
127.0.0.1 newdirection.local
```
