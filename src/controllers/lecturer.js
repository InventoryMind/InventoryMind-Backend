const Lecturer =require('../models/Lecturer');

exports.approve = async(req,res)=>{
    const lecturer= new Lecturer({email:req.user.email,userType:req.user.userType,userId:req.user.userId});
    const result=await lecturer.approve(req.params.reqId);

    if (result.validationError){
        return res.status(400).json({
            msg:"validation error"
        });
    }

    if (result.connectionError){
        return res.status(500).json({
            msg:"connection error"
        });
    }

    if (result.action){
        return res.status(200).json({
            msg:"Approved"
        });
    }

    return res.status(201).json({
        msg:"Failed"
    });
}

exports.reject = async(req,res)=>{
    const lecturer= new Lecturer({email:req.user.email,userType:req.user.userType,userId:req.user.userId});
    const result=await lecturer.reject(req.params.reqId);

    if (result.validationError){
        return res.status(400).json({
            msg:"validation error"
        });
    }

    if (result.connectionError){
        return res.status(500).json({
            msg:"connection error"
        });
    }

    if (result.action){
        return res.status(200).json({
            msg:"Reejcted"
        });
    }

    return res.status(201).json({
        msg:"Failed"
    });
}

exports.getDashboardDataMob = async(req,res)=>{
    const lecturer= new Lecturer({email:req.user.email,userType:req.user.userType,userId:req.user.userId});
    const result=await lecturer.getDashboardDataMob();

    if (result.connectionError){
        return res.status(500).json({
            msg:"connection error"
        });
    }

    if (result.action){
        return res.status(200).json({
            msg:result
        });
    }

    return res.status(201).json({
        msg:"Failed"
    });
}

exports.getUserDetails = async(req,res)=>{
    const lecturer= new Lecturer({email:req.user.email,userType:req.user.userType,userId:req.user.userId});
    const result=await lecturer.getUserDetails();

    if (result.connectionError){
        return res.status(500).json({
            msg:"connection error"
        });
    }

    if (result.action){
        return res.status(200).json({
            msg:result
        });
    }

    return res.status(201).json({
        msg:"Failed"
    });
}