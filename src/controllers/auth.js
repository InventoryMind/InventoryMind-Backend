const jwt = require ('jsonwebtoken');
const Admin = require('../models/Admin');

const User=require('../models/User');

exports.login =async (req,res)=>{
    // console.log(req);
    const user=new User({email:req.body.email,userType:req.body.userType});
    const result=await user.login(req.body.password);
    if (result.validationError){
        return res.status(400).json({
            title:"Validation Error",
            status:400,
            message: "Email is Ivalid. Enter a valid email address"
        });
    }

    if (result.connectionError)
    return res.status(500).json({
      title: "Error",
      status: "500",
      message: "Internal Server Error",
    });

    if (!result.allowedAccess){
        return res.status(401).json({
            title: "Error",
            status: "401",
            message: "Access Denied! Unauthorized Client",
        });
    }

    const cookieOption={
        expires: new Date(Date.now() + 24*60*60*1000),
        httpOnly: true
    };

    const payload=JSON.parse(JSON.stringify(result.tokenData));
    const token = jwt.sign(payload,process.env.jwtPrivateKey,{expiresIn:"1d"});
    let data={userId:payload.userId,email:payload.email,firstName:payload.firstName,lastName:payload.lastName,userType:payload.userType};
    res.cookie("auth-token",token,cookieOption).status(200).json({
        title: "Status",
        status: "200",
        message: "User Loginned Succesfully",
        token:token
    });
};

exports.forgotPassword =async (req,res)=>{
    const user=new User({email:req.body.email,userType:req.body.userType});
    const result=await user.forgotPassword();
    if (result.connectionError){
        return res.status(500).json({
            title: "Error",
            status: "500",
            message: "Internal Server Error",
          });      
    }

    if (result.noAcc){
        return res.status(400).json({
            title: "Invalid Email",
            status: "400",
            message: "No user found with this email address",
          });      
    }

    if (result.action){
        const cookieOption={
            expires: new Date(Date.now() + 10*60*1000),
            httpOnly: true
        };
        console.log("action true")
        const payload=JSON.parse(JSON.stringify({email:req.body.email,userType:req.body.userType}));
        const token = jwt.sign(payload,process.env.jwtPrivateKey,{expiresIn:"1h"});
       return res.cookie("reset-token",token,cookieOption).status(200).json({
            title: "Status",
            status: "200",
            message: "Verification code sent to your email",
        });
    }
        return res.status(400).json({
            title: "Error",
            status: "400",
            message: "Try again later",
          });
}

exports.resendForgotPassword =async (req,res)=>{
    const user=new User({email:req.user.email,userType:req.user.userType});
    const result=await user.forgotPassword();
    if (result.connectionError){
        return res.status(500).json({
            title: "Error",
            status: "500",
            message: "Internal Server Error",
          });      
    }

    if (result.noAcc){
        return res.status(400).json({
            title: "Invalid Email",
            status: "400",
            message: "No user found with this email address",
          });      
    }

    if (result.action){
       return res.status(200).json({
            title: "Status",
            status: "200",
            message: "Verification code sent to your email",
        });
    }
        return res.status(400).json({
            title: "Error",
            status: "400",
            message: "Try again later",
          });
}

    exports.resetPassword =async (req,res)=>{
        const user=new User({email:req.user.email,userType:req.user.userType});
        const result=await user.resetPassword(req.body.verificationCode,req.body.newPassword);
        // console.log(req.body)
        if (result.connectionError){
            return res.status(500).json({
                title: "Error",
                status: "500",
                message: "Internal Server Error",
              });      
        }
        console.log(result)
        if (result.action){
            const cookieOption = {
                expires:new Date(Date.now() - 24*60*60*1000),
                httpOnly : true
            };
            return res.cookie('reset-token',"",cookieOption).status(200).json({
                title:"Success",
                status:200,
                message:"Password changed successfully"
            });
        }
        
        if (result.invalidVC){
            return res.status(400).json({
                title: "Error",
                status: "400",
                message: "Invalid Verification Code",
              });
        }
        return res.status(400).json({
            title: "Error",
            status: "400",
            message: "Try again later",
          });
      
    }

exports.logout=(req,res)=>{
    const cookieOption = {
        expires:new Date(Date.now() - 24*60*60*1000),
        httpOnly : true
    };
    res.cookie('auth-token',"",cookieOption).status(200).json({
        title:"Log out",
        status:200,
        message:"Logged Out",
        token:""
    });
}
