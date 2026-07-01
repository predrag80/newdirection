# New Direction

Next.js site for the NWD landing page, project case studies and contact form.

## Local development

```bash
npm install
npm run dev
```

Open `http://newdirection.local:3000` or `http://localhost:3000`.

## Production build

```bash
npm run build
npm run start
```

The contact form uses `src/app/api/contact`, so the app must run as a Next.js server process. It is not a static `out/` export.

Use Node.js 20.9 or newer. With `nvm`, run `nvm use` from the project root.

Required environment variables are listed in `.env.example`.

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
