import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/User.js';
export const registerUser = async (req, res) => {
  try {
    const { userName, userEmail, password, role } = req.body;

    if (!userName || !userEmail || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Please fill all data",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ userName }, { userEmail }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User Name or User Email already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      userName,
      userEmail,
      role,
      password: hashPassword,
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User Registered Successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error! Please try again later.",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { userEmail, password } = req.body;
    const checkUser = await User.findOne({ userEmail });

    if (!checkUser) {
      return res.status(401).json({
        success: false,
        message: "Email Not Found!",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, checkUser.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Password is Incorrect!",
      });
    }

    const accessToken = jwt.sign(
      {
        _id: checkUser._id,
        userName: checkUser.userName,
        userEmail: checkUser.userEmail,
        role: checkUser.role,
      },
      "JWT_SECRET",
      { expiresIn: "120m" }
    );

    return res.status(200).json({
      success: true,
      message: "Logged in Successfully!",
      data: {
        accessToken,
        user: {
          _id: checkUser._id,
          userName: checkUser.userName,
          userEmail: checkUser.userEmail,
          role: checkUser.role,
        }, 
      },
    }); 
  } catch (error) {  
    return res.status(500).json({
      success: false,
      message: "Server Error! Please try again later.",
    });
  }
};


