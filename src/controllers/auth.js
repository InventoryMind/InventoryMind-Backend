const jwt = require ('jsonwebtoken');
const config = require('config');
const User=require('../models/User');

exports.login =async (req,res)=>{
    console.log(req);
    const user=new User(req.body);
    const result=await user.login();
    if (result.validationError){
        console.log("dgdagd");
        return res.status(400).json({
            alert : {
                type : "danger",
                message: "Email is Ivalid. Enter a valid email address"
            }
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
            alert: {
                type: 'Danger',
                message : "Access Denied! Unauthorized Client"
            }
        });
    }

    const cookieOption={
        expires: new Date(Date.now() + 24*60*60*1000),
        httpOnly: true
    };

    const payload=JSON.parse(JSON.stringify(result.tokenData));
    const token = jwt.sign(payload,config.get("jwtPrivateKey"));
    res.cookie("auth-token",token,cookieOption).status(200).json({isLoginned: true});
};

exports.logout=(req,res)=>{
    const cookieOption = {
        expires:new Date(Date.now() - 24*60*60*1000),
        httpOnly : true
    };
    res.cookie('auth-token',"",cookieOption).status(200).json("logged out");
}