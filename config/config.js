 module.exports = {
   development: {
     username: process.env.DB_USER || 'postgres',
     password: process.env.DB_PASS || 'postgres',
     database: process.env.DB_USER || "Photo-Caption",
     host: process.env.DB_HOST || 'localhost',
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
