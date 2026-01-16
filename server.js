const express = require("express");

const jwt = require("jsonwebtoken")
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require("./swagger/swagger.json");
const path = require("path");
const userRouter = require("./routes/usersRoute")
const imagesRouter = require("./routes/imagesRoutes")
const votesRouter = require("./routes/votesRouts")
const db = require("./models"); // ✅ not "./models/index"
const cookieParser = require("cookie-parser");

const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3000;


// يجعل أي ملف داخل uploads متاح عبر رابط:
// http://localhost:3000/uploads/...
app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(cookieParser());

app.use("/api",imagesRouter)

app.use("/api",userRouter)
app.use("/api",votesRouter)

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
