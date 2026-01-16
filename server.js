const express = require("express");
const session =require("express-session")
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require("./swagger/swagger.json");
const path = require("path");
const userRouter = require("./routes/usersRoute")
const imagesRouter = require("./routes/imagesRoutes")
const db = require("./models"); // ✅ not "./models/index"

const app = express();

const PORT = process.env.PORT || 3000;

const store =new session.MemoryStore();
// يجعل أي ملف داخل uploads متاح عبر رابط:
// http://localhost:3000/uploads/...
app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(
session({
secret:"D53gxl41G",
resave:false,
cookie: {maxAge:1000 *60 *60 *24,secure:false,sameSite:"lax" },
saveUninitialized:true,
store,
  })
);
app.use("/api",imagesRouter)

app.use("/api",userRouter)

app.get("/api", (req, res) => {
  res.send("hello world");
});

(async () => {
  try {
    await db.sequelize.authenticate();
    console.log("Database connected successfully.");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
})();

module.exports = app
