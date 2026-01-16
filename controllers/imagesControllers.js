
const db = require("../models/index")
const path = require("path")
const fs = require("fs");

module.exports ={

  addNewImage:async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file uploaded. Use field name: image" });
      }
  
      // هذا هو الرابط الذي ستستخدمه في الواجهة
      const publicUrl = `/uploads/images/${req.file.filename}`;
  
      // خزّن metadata + الرابط في DB
      const image = await db.Images.create({
        
        imageUrl: publicUrl,
        alt: req.body.alt || null,
        mimeType: req.file.mimetype,
        sizeBytes: req.file.size,
        originalName: req.file.originalname,
       
      });
  
      return res.status(201).json({
        message: "Image uploaded successfully",
        image: {
          id: image.id,
          url: image.imageUrl,
          alt: image.alt,
          mimeType: image.mimeType,
          sizeBytes: image.sizeBytes,
        },
      });
    } catch (err) {
      return res.status(500).json({ 
        
        message: "Upload failed",
         error: err.message ,
         details: err?.errors?.map(e => ({
      message: e.message,
      path: e.path,
      value: e.value,
      validatorKey: e.validatorKey
        
        
        }))
    })
  }},
  getAllImages:async(req,res)=>{
  try{
  const images =await db.Images.findAll();
    console.log(images)
  res.status(200).json({status:"done",images:images})
 
  }catch(err){

    res.status(500).json({status:"failed retriving all images.",error:err.message})
  }
},
getImageById:async(req,res)=>{
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
  },
  addNewCaption:async(req,res)=>{
     try {
      const { caption } = req.body;
       const image = await db.Images.findOne({where:{id:req.params.id}});
        
      if (!image) {
        return res.status(404).json({ message: "image not found" });
      }
      if (!caption || caption.trim() === "") {
        return res.status(400).json({ message: "caption is required" });
      }
 
      const user = await db.Users.findOne()
  
      const Caption = await db.Captions.create({text: caption,imageId:image.id,userId: req.user.id});
  
      return res.status(200).json({
        message: "caption added successfully",
        Caption,
      });
    } catch (error) {
      return res.status(500).json({
        message: "server error",
        error: error.message,
      });
    }
  },
  deleteImage:async(req,res)=>{

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

 
},
deleteCaption:async (req, res, next) => {
  try {
    const captionId = Number(req.params.id);
    const currentUser = req.user;

    if (!captionId || Number.isNaN(captionId)) {
      return res.status(400).json({ error: 'captionId not valid' });
    }

    // 1️⃣ التأكد أن الـCaption موجود
    const caption = await db.Captions.findByPk(captionId);

    if (!caption) {
      return res.status(404).json({ error: 'Caption not found' });
    }

    // 2️⃣ Authorization
    const isOwner = caption.userId === currentUser.id;
    const isAdmin = currentUser.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        error: 'not authorized to delete the caption'
      });
    }

    // 3️⃣ حذف الـCaption
    await db.Captions.destroy({where:{id:captionId}});

    return res.json({
      message: 'caption deleted successfully',
      captionId
    });
  } catch (err) {
    return next(err);
  }

}
}
