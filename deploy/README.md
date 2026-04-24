# Docker deploy for game.s4md.com

This repo can run without PM2 by using Docker Compose:

- `server`: Express + Socket.IO app on internal port `3000`.
- `client`: Nginx serving the built Vue app and proxying `/api` + `/socket.io` to `server`.
- Host Nginx only forwards `game.s4md.com` to `127.0.0.1:8080`.

## First deploy

```bash
cd /root/goals
docker compose up -d --build
```

Install the host Nginx vhost:

```bash
sudo cp deploy/nginx/game.s4md.com.conf /etc/nginx/sites-available/game.s4md.com
sudo ln -sf /etc/nginx/sites-available/game.s4md.com /etc/nginx/sites-enabled/game.s4md.com
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d game.s4md.com
```

## Updates

```bash
cd /root/goals
git pull
docker compose up -d --build
```

## Useful checks

```bash
docker compose ps
docker compose logs -f server
docker compose logs -f client
curl -I http://127.0.0.1:8080
```
