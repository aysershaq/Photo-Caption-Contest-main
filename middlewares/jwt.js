const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.cookies.access_token;
     console.log("inside verifyToken ",token)

  if (!token) {
     return res.status(401).json({ message: "you must be logged in" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded",decoded)
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = verifyToken;