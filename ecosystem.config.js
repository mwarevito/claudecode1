/**
 * PM2 Configuration for Production Deployment
 * 
 * Usage:
 *   pm2 start ecosystem.config.js
 *   pm2 logs notion-bot
 *   pm2 restart notion-bot
 *   pm2 stop notion-bot
 */

module.exports = {
  apps: [{
    name: 'notion-bot',
    script: './dist/index.js',
    instances: 1,
    exec_mode: 'fork',
    
    // Auto-restart on crashes
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    
    // Environment variables
    env: {
      NODE_ENV: 'production',
    },
    
    // Logging
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    
    // Restart policy
    min_uptime: '10s',
    max_restarts: 10,
    restart_delay: 4000,
  }],
};
