module.exports = {
    apps : [{
      name        : "MyApp",
      script      : "./server.js",
      watch       : true,
      instances  : "max",
      exec_mode  : "cluster",
      env: {
        "NODE_ENV": "production"
      },
      env_production : {
        "PORT": 80,
      }
    }]
  }