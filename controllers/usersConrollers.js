const { Votes, Captions } = require('../models');
const db = require("../models/index")
const bcrypt = require("bcrypt")


module.exports={

  getAllUsers:async(req,res)=>{
  try{
    const users = await db.Users.findAll();
    return res.json({status:"retrived successfully",users:users})
  
  }catch(err){
  
    res.status(500).json({staus:"failed",error:err.message})
  }},
  getUserById:async(req,res)=>{
  
    const user = await db.Users.findOne({where:{id:req.params.id}})
      if(user){
    return res.status(200).json({staus:"success",user:user})
      }else{
            res.status(500).json({staus:"user Not found"})
  
      }
  },
  deleteUser:async(req,res)=>{
  
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
    
  
  
  },
  addNewUser:async(req, res) => {
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
  },
  logInUser:async(req,res)=>{

  const {email,password} = req.body;

 
const user = await db.Users.findOne({ where: { email:email } });

if(user===null){
  res.status(500).send("User Not found")
 
}else{
try{
const matchedPassword = await bcrypt.compare(password, user.passwordHash);

if(matchedPassword){
 
  // req.session.userId = user.id;
   req.session.authenticated =true;
   req.session.userId = user.id
   req.session.user = {id:user.id ,role:user.role}

//   req.session.user= {
//       email,
      
//   }
 res.status(200).json({status:"login successfully",user:user})
 }else {
  return res.status(401).send("Password not matched");
}

}catch(err){

  res.status(500).json({status:"failed login ",error:err.message})
}

}
},
logOutUser:(req, res) => {
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
},

updateUserRole: async (req, res, next) => {
  try {
    const targetUserId = req.params.id;
    const { role } = req.body;

    // 1️⃣ التحقق من القيم المسموحة
    const allowedRoles = ['user', 'admin'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        error: 'قيمة role غير صالحة'
      });
    }

    // 2️⃣ منع الأدمن من تغيير دوره بنفسه (اختياري لكن احترافي)
    if (req.session.userId === Number(targetUserId)) {
      return res.status(400).json({
        error: 'you cant change your own role'
      });
    }

    // 3️⃣ التأكد أن المستخدم موجود
    const user = await db.Users.findByPk(targetUserId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // 4️⃣ تحديث الدور
    const oldRole = user.role;
    user.role = role;
    await user.save();

    // 5️⃣ Audit log (مهم)
    console.log(
      `[ROLE CHANGE] Admin(${req.session.userId}) changed user(${user.id}) from ${oldRole} to ${role}`
    );

    return res.json({
      message: 'Role has been updated successfully',
      userId: user.id,
      oldRole,
      newRole: role
    });
  } catch (err) {
    next(err);
  }
}

}