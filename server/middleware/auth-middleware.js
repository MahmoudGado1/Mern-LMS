import jwt from 'jsonwebtoken'
const verifyToken = (token,secretKey)=>{
  return jwt.verify(token,secretKey) 
} 
export const authenticate = (req,res,next)=>{
  const authHeader = req.headers.authorization;

  if(!authHeader){ 
    return res.status(401).json({ 
      success:false,
      message:"User is not authenticated"
    })
  }

  //Authorization: Bearer <TOKEN>
  const token = authHeader.split(" ")[1];
 
  try {
    const payload = verifyToken(token, "JWT_SECRET");
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
  
}
