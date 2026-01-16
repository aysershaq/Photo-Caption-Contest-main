 module.exports = {
   development: {
     username: "postgres",
     password: "postgres",
     database: "Photo-Caption",
     host: "localhost",
     dialect: "postgres",
  },
  test: {
    username: "postgres",
    password: "postgres",
    database: "Photo-Caption",
    host: "localhost",
    dialect: "postgres",
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
  },
};
