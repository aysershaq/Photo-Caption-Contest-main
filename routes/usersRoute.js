

const express = require("express")
const db = require("../models"); 
const bcrypt = require("bcrypt")
const session =require("express-session")

const userRouter =  express.Router();







userRouter.get("/allUsers",async(req,res)=>{
try{
  const users = await db.Users.findAll();
  return res.json({status:"retrived successfully",users:users})

}catch(err){

  res.status(500).json({staus:"failed",error:err.message})
}})


userRouter.get("/user/:id",async(req,res)=>{

  const user = await db.Users.findOne({where:{id:req.params.id}})
    if(user){
  return res.status(200).json({staus:"success",user:user})
    }else{
          res.status(500).json({staus:"user Not found"})

    }
})
  

userRouter.delete("/user/:id",async(req,res)=>{

  const user = await db.Users.findOne({where:{id:req.params.id}})
  if(user){
await db.Users.destroy({
  where: {
    id: req.params.id,
  },
})
return res.status(200).json({status:"deleted successfuuly",user:user})

  }else{
    res.send("User Not found")
  }
  


})


userRouter.post("/register", async(req, res) => {
  const { username,email, password } = req.body;

let user = await db.Users.findAll({where:{ email: email }});
  console.log(user)
if(user.length!==0){
  res.status(500).send("User already exists")
 
}else{

try{

  
 const salt = await bcrypt.genSalt(10);
    console.log(salt)
 
const hash = await bcrypt.hash(password, salt);

const  newUser = await db.Users.create({
    username,
    email,
    passwordHash:hash
  });
 

  res.status(201).json({status:"User registered successfully",user:newUser})
  
}catch(err){
   console.log("name:", err.name);
  console.log("message:", err.message);
  console.log("pg:", err.parent?.message);
  console.log("detail:", err.parent?.detail);
  console.log("errors:", err.errors);
  return res.status(500).json({ error: err.message, detail: err.parent?.detail });

  console.log(err.message)
  res.status(500).json({status:"failed registering",error:err.message})
}
}
});


userRouter.post("/login",async(req,res)=>{

  const {email,password} = req.body;

 
const user = await db.Users.findOne({ where: { email:email } });

if(user===null){
  res.status(500).send("User Not found")
 
}

else{
try{
const matchedPassword = await bcrypt.compare(password, user.passwordHash);

if(matchedPassword){
 
  // req.session.userId = user.id;
   req.session.authenticated =true;
   req.session.userId = user.id

  req.session.user= {
      email,
      password,
  }
 res.status(200).json({status:"login successfully",user:user})
 }else {
  return res.status(401).send("Password not matched");
}

}catch(err){

  res.status(500).json({status:"failed login ",error:err.message})
}

}
})

userRouter.post("/logout", (req, res) => {
  // إذا كانت هناك جلسة
  if (req.session) {
    // دمار الجلسة في الـ store
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ message: "Logout failed", error: err.message });
      }
      // إزالة كوكي من المتصفح/العميل
      res.clearCookie("connect.sid" ,{ path: "/" });
      return res.status(200).json({ message: "Logged out successfully" });
    });
  } else {
    // لو ما في جلسة أصلاً
    return res.status(200).json({ message: "No active session" });
  }
});
module.exports = userRouter