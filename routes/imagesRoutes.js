const express = require("express")
const app =  require("../server")
const db = require("../models"); 
const { cacheResponse } = require("../middlewares/cache");

const bcrypt = require("bcrypt")

 const imagesRouter = express.Router();

const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Images = require("../models/images"); // أو المسار الصحيح عندك

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



imagesRouter.post("/add-images", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded. Use field name: image" });
    }

    // هذا هو الرابط الذي ستستخدمه في الواجهة
    const publicUrl = `/uploads/images/${req.file.filename}`;

    // خزّن metadata + الرابط في DB
    const image = await db.Images.create({
      id:req.id,
      imageUrl: publicUrl,
      alt: req.body.alt || null,
      mimeType: req.file.mimetype,
      sizeBytes: req.file.size,
      originalName: req.file.originalname,
      user_id: req.id // لو عندك auth
    });

    return res.status(201).json({
      message: "Image uploaded successfully",
      image: {
        id: image.id,
        url: image.url,
        alt: image.alt,
        mimeType: image.mimeType,
        sizeBytes: image.sizeBytes,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Upload failed", error: err.message });
  }
});



imagesRouter.get("/all-images",async(req,res)=>{
  try{
  const images =await db.Images.findAll();
    console.log(images)
  res.status(200).json({status:"done",images:images})
 
  }catch(err){

    res.status(500).json({status:"failed retriving all images.",error:err.message})
  }
})


 imagesRouter.get("/image/:id",async(req,res)=>{
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid envelope ID' });
  }

    try{
        const image = await db.Images.findAll({
          where:{
              id:req.params.id
          }
        })
        console.log(image)
        if(image.length===0){
                  
          
          res.status(404).json({status:"image not found"})

        }
                res.status(200).json({status:"image retrived successfully",image:image})

    }catch(err){

        res.status(500).json({ error: 'Internal server error' });

    }
  })


   imagesRouter.post("/add-caption/:id",authorizedUser,async(req,res)=>{
   try {
    const { caption } = req.body;
     const image = await db.Images.findByPk(req.params.id);

    if (!image) {
      return res.status(404).json({ message: "image not found" });
    }
    if (!caption || caption.trim() === "") {
      return res.status(400).json({ message: "caption is required" });
    }

   

    await image.update({ caption, captionByUserId: req.session.userId, });

    return res.status(200).json({
      message: "caption added successfully",
      image,
    });
  } catch (error) {
    return res.status(500).json({
      message: "server error",
      error: error.message,
    });
  }
});
   

imagesRouter.delete("/image/:id",async(req,res)=>{

  const image =await db.Images.findOne({where:{
    id:req.params.id
  }})

   if(image===null){
    res.send("image Not found")
   }else{

     // 2️⃣ تحويل الرابط المخزن إلى مسار فعلي
    // image.imageUrl مثال: /uploads/abc123.jpg
    const imagePath = path.join(
      __dirname,
      "..",   
  
      image.imageUrl
    );
    console.log(imagePath)
    // 3️⃣ حذف الملف من مجلد uploads
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
   await  db.Images.destroy({
    where:{
      id:req.params.id
    }
  })
   return res.json({status:"image deleted successfully",image:image})
}

 
})


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

