module.exports = {
  apps: [
    {
      name: "newdirection",
      cwd: "/var/www/newdirection/current",
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
        PORT: "3000"
      }
    }
  ]
};
