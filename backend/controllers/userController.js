const User=require("../models/userModel")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")

const registerUser=async(req,res)=>{
    try{
        const {fullname,phoneNo,email,password,lat,lng}=req.body;
        const userExists=await User.findOne({email});
        if(userExists){
            return res.status(400).json({
                success:false,
                message:"User already exists"
            })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user=await User.create({
            fullname,
            phoneNo,
            email,
            password:hashedPassword,
            lat,
            lng
        });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.status(200).json({
            success:true,
            message:"User created successfully",
            user,
            token
        })
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:err.message
        })
    }
}

module.exports={
    registerUser
}
