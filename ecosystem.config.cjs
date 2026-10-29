module.exports = {
  apps: [
    {
      name: "newdirection",
      cwd: "/var/www/newdirection/current",
      script: "npm",
      // Only nginx should reach the app; keep port 3000 off the public interface.
      args: "run start -- --hostname 127.0.0.1",
      env: {
        NODE_ENV: "production",
        PORT: "3000"
      }
    }
  ]
};
