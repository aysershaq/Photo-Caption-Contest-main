const db = require("../models/index")

function ensureAdmin(req, res, next) {

 
  if ( req.session.user.role === 'admin') {
    return next();
  }else{
  return res.status(403).json({
    error: 'not authorized , you must be admin'
  });
}
}

function ensureAuth(req, res, next) {
  if (req.session.authenticated===true) {
    return next();
  }else{
  return res.status(401).json({ error: 'you must be logged in ' });
}
}

module.exports ={ensureAdmin,ensureAuth}