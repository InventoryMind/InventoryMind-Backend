const jwt = require ('jsonwebtoken');

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
    const token = jwt.sign(payload,process.env.jwtPrivateKey);
    let data={userId:payload.userId,email:payload.email,firstName:payload.firstName,lastName:payload.lastName};
    res.cookie("auth-token",token,cookieOption).status(200).json({
        title: "Status",
        status: "200",
        message: "User Loginned Succesfully",
        data:data
    });
};

exports.logout=(req,res)=>{
    const cookieOption = {
        expires:new Date(Date.now() - 24*60*60*1000),
        httpOnly : true
    };
    res.cookie('auth-token',"",cookieOption).status(200).json({
        title:"Log out",
        status:200,
        message:"Logged Out"
    });
}
