# 🚀 Deployment Guide

## Deployment Options

### 1. Local Development (Recommended for Testing)

```bash
npm run dev
```

Keep it running in a terminal. Press Ctrl+C to stop.

---

### 2. PM2 (Recommended for VPS/Server)

PM2 keeps your bot running in the background and auto-restarts on crashes.

#### Install PM2
```bash
npm install -g pm2
```

#### Start the Bot
```bash
# Build first
npm run build

# Start with PM2
pm2 start ecosystem.config.js

# View logs
pm2 logs notion-bot

# Other commands
pm2 restart notion-bot
pm2 stop notion-bot
pm2 delete notion-bot
```

#### Auto-start on Server Reboot
```bash
pm2 startup
pm2 save
```

---

### 3. Docker (Recommended for Containers)

#### Build and Run
```bash
# Build the image
docker build -t notion-telegram-bot .

# Run the container
docker run -d \
  --name notion-bot \
  --env-file .env \
  --restart unless-stopped \
  notion-telegram-bot
```

#### Using Docker Compose (Easier)
```bash
# Start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down

# Restart
docker-compose restart
```

#### Update and Redeploy
```bash
git pull
docker-compose down
docker-compose up -d --build
```

---

### 4. Cloud Platforms

#### Railway.app (Free Tier Available)
1. Fork the repo to your GitHub
2. Go to https://railway.app
3. Click "New Project" → "Deploy from GitHub"
4. Select your repo
5. Add environment variables in Railway dashboard
6. Deploy!

#### Heroku
```bash
# Install Heroku CLI
brew install heroku/brew/heroku

# Login
heroku login

# Create app
heroku create your-notion-bot

# Set environment variables
heroku config:set NOTION_TOKEN=your_token
heroku config:set TELEGRAM_BOT_TOKEN=your_token
# ... set all other variables

# Deploy
git push heroku main
```

#### DigitalOcean App Platform
1. Create a new app
2. Connect your GitHub repo
3. Set environment variables
4. Deploy

---

## Environment Variables Checklist

Before deploying, ensure these are set:

- ✅ `NOTION_TOKEN`
- ✅ `TELEGRAM_BOT_TOKEN`
- ✅ `NOTION_DB_OBJECTIVES`
- ✅ `NOTION_DB_PROJECTS`
- ✅ `NOTION_DB_WEEKLY_OUTCOMES`
- ✅ `NOTION_DB_DAILY_MITS`
- ⚙️ `TIMEZONE` (optional, defaults to UTC)

---

## Monitoring

### PM2 Monitoring
```bash
# Real-time monitoring
pm2 monit

# Web dashboard
pm2 plus
```

### Docker Logs
```bash
# Follow logs
docker logs -f notion-bot

# Last 100 lines
docker logs --tail 100 notion-bot
```

### Health Check
Send `/start` to your bot on Telegram. If it responds, it's working!

---

## Troubleshooting

### Bot not responding
1. Check if process is running: `pm2 list` or `docker ps`
2. Check logs: `pm2 logs` or `docker logs notion-bot`
3. Verify environment variables are set correctly
4. Test Notion API connection manually

### High memory usage
- Restart the bot: `pm2 restart notion-bot`
- Check for memory leaks in logs
- Consider increasing memory limit in PM2 config

### Crashes on startup
- Check logs for error messages
- Verify all environment variables are set
- Test configuration: `npm run check`

---

## Security Best Practices

1. **Never commit `.env` file** (already in `.gitignore`)
2. **Use environment variables** for all secrets
3. **Keep dependencies updated**: `npm audit` and `npm update`
4. **Run as non-root user** (Docker already configured)
5. **Use HTTPS** if exposing webhooks (not needed for polling)

---

## Backup Strategy

Your data is in Notion, so the bot is stateless. To backup:

1. **Export Notion workspace** regularly
2. **Keep `.env` file** backed up securely (encrypted)
3. **Version control** your code changes

---

## Scaling

This bot uses **polling** (not webhooks), so:
- ✅ Works behind firewalls/NAT
- ✅ No need for public IP or domain
- ✅ Simple deployment
- ⚠️ Single instance only (don't run multiple copies)

If you need to scale to multiple users, consider:
- Adding a database for user sessions
- Implementing webhooks instead of polling
- Using Redis for state management

---

## Cost Estimates

- **Local/VPS with PM2**: Free (if you have a server)
- **Railway**: Free tier available, ~$5/month for hobby
- **Heroku**: ~$7/month for Eco dyno
- **DigitalOcean**: ~$5/month for basic droplet
- **Docker on VPS**: Same as VPS cost

**Recommended**: Start with Railway free tier or local PM2.

---

## Quick Deploy Checklist

- [ ] Code is working locally (`npm run dev`)
- [ ] All tests pass
- [ ] Environment variables documented
- [ ] `.env.example` is up to date
- [ ] Build succeeds (`npm run build`)
- [ ] Configuration validated (`npm run check`)
- [ ] Deployment method chosen
- [ ] Monitoring set up
- [ ] Backup strategy in place

---

**Need help?** Check the logs first, they're very detailed!
