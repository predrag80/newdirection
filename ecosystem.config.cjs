module.exports = {
  apps: [
    {
      name: "newdirection",
      cwd: "/var/www/newdirection",
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
        PORT: "3000"
      }
    }
  ]
};
