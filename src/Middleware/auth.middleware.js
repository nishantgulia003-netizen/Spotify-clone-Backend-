const jwt = require("jsonwebtoken");

async  function authArtist(req,res,next){
    const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }
    
      try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    
        if (decoded.role !== "artist") {
          return res.status(403).json({ message: "You don't have access to create music" });
        }
        req.user = decoded;

        next();
}

catch (err) {
    console.error("uploadMusic error:", err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
}

async function authUser(req,res,next){
  const token = req.cookies.token;
  if(!token){
    return res.status(401).json({message: "unauthorized"});
  }
  try{
    const decoded= jwt.verify(token ,process.env.JWT_SECRET);
    if(decoded.role!=="user"&& decoded.role!=="artist"){
      return res.status(403).json({message: "You are not a user .Login or register first"});
    }
    req.user = decoded;

    next();
  }
  catch(err){
    console.error("authUser error:", err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
}

module.exports = {authArtist, authUser};