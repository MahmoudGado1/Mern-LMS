import express from 'express'
import { registerUser, loginUser } from '../../controllers/auth-controller/index.js'
import { authenticate } from '../../middleware/auth-middleware.js'
const authRoutes=express.Router()

authRoutes.post('/register',registerUser)
authRoutes.post('/login',loginUser)
authRoutes.get('/check-auth',authenticate,(req,res)=>{
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "User is authenticated!",
    data:{
      user
    } 
  }) 
})


export default authRoutes