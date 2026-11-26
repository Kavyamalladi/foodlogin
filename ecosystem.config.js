module.exports = {
  apps: [
    {
      name: "foodlogin",
      cwd: "/var/www/foodlogin",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
        HOSTNAME: "0.0.0.0",
        HOST: "0.0.0.0",
      },
      max_memory_restart: "512M",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    },
  ],
};
