module.exports = {
  apps: [
    {
      name: 'nahockey-api',
      script: './dist/index.js',
      cwd: '/var/www/nahockey/backend',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: '/var/log/nahockey/err.log',
      out_file: '/var/log/nahockey/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
};
