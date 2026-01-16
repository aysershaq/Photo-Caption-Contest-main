const express = require("express")
const app =  require("../server")
const db = require("../models"); 
const { cacheResponse } = require("../middlewares/cache");
const imagesContollers = require("../controllers/imagesControllers")

const bcrypt = require("bcrypt")

 const imagesRouter = express.Router();

const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Images = require("../models/images"); // أو المسار الصحيح عندك
const { ensureAuth, ensureAdmin } = require("../middlewares/auth");

// تأكد أن المجلد موجود
const uploadDir = path.join(__dirname, "uploads", "images");
fs.mkdirSync(uploadDir, { recursive: true });

// إعداد التخزين على القرص
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, safeName);
  },
});

// فلترة نوع الملف (صور فقط)
function fileFilter(req, file, cb) {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Only image files are allowed (jpeg, png, webp, gif)."), false);
  }
  cb(null, true);
}

// حد أقصى للحجم: 5MB
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 },
});


function authorizedUser(req,res,next) {
// Check for the authorized property within the session


 if (req.session && req.session.authenticated=== true) {
    return next(); // السماح بالوصول
  
}else{return res.status(401).json({
    message: "Authentication required"
  });
}
};



imagesRouter.post("/add-image", upload.single("image"),ensureAuth,ensureAdmin, imagesContollers.addNewImage);



imagesRouter.get("/all-images",ensureAuth,imagesContollers.getAllImages)


 imagesRouter.get("/image/:id",ensureAuth,imagesContollers.getImageById)


   imagesRouter.post("/add-caption/:id",ensureAuth,imagesContollers.addNewCaption);
   

imagesRouter.delete("/image/:id",ensureAuth,ensureAdmin,imagesContollers.deleteImage)

imagesRouter.delete("/delete-caption/:id",ensureAuth,imagesContollers.deleteCaption)
  // Create a new user object to store in the database:
 
 
  
   
// Error handler خاص بـ multer (اختياري لكنه مفيد)
// app.use((err, req, res, next) => {
//   if (err && err.message) {
//     // أخطاء multer مثل الحجم أو الفلترة
//     return res.status(400).json({ message: err.message });
//   }
//   next(err);
// });




module.exports = imagesRouter

