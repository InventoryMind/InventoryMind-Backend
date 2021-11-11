const Lecturer =require('../models/Lecturer');


exports.changePassword=async (req,res)=>{
    // console.log(req.body)

    const lecturer=new Lecturer({email:req.user.email,userType:req.user.userType,userId:req.user.userId});
    const results=await lecturer.changePassword(req.body.currentPass,req.body.newPass);
    if (results.connectionError){
        return res.status(500).json({  
            title: "Error",
            status: "500",
            message: "Internal Server Error",
        });
    }
    // console.log(results.action);
    if (results.action){
        return res.status(200).json({
            title: "Success",
            status: "200",
            message: "Successfully Changed Password",
            // success:true
        })
    }

    if (results.invalidPass){
        return res.status(400).json({
            title: "Failed",
            status: "400",
            message: "Invalid Password",
            // success:false
        })
    }
    return res.status(400).json({
        title: "Failed",
        status: "400",
        message: "Try agin later",
        // success:false
    })

}

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

    return res.status(400).json({
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

    return res.status(400).json({
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

    return res.status(400).json({
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

    return res.status(400).json({
        msg:"Failed"
    });
}

exports.viewAllRequests=async (req,res)=>{
    const lecturer= new Lecturer({email:req.user.email,userType:req.user.userType,userId:req.user.userId});
    const result = await lecturer.viewAllRequests();
    // console.log(result);
    if (result.connectionError){
        return res.status(500).json({
            msg:"connection error"
        });
    }

    if (result.action){
        return res.status(200).json({
            msg:result.data
        });
    }

    return res.status(400).json({
        msg:"Failed"
    })
}

exports.viewAcceptedRequest=async (req,res)=>{
    const lecturer= new Lecturer({email:req.user.email,userType:req.user.userType,userId:req.user.userId});
    const result = await lecturer.viewAcceptedRequest();
    // console.log(result);
    if (result.connectionError){
        return res.status(500).json({
            msg:"connection error"
        });
    }

    if (result.action){
        return res.status(200).json({
            msg:result.data
        });
    }

    return res.status(400).json({
        msg:"Failed"
    })
}

exports.viewRejectedRequest=async (req,res)=>{
    const lecturer= new Lecturer({email:req.user.email,userType:req.user.userType,userId:req.user.userId});
    const result = await lecturer.viewRejectedRequest();
    // console.log(result);
    if (result.connectionError){
        return res.status(500).json({
            msg:"connection error"
        });
    }

    if (result.action){
        return res.status(200).json({
            msg:result.data
        });
    }

    return res.status(400).json({
        msg:"Failed"
    })
}

exports.viewPendingRequest=async (req,res)=>{
    const lecturer= new Lecturer({email:req.user.email,userType:req.user.userType,userId:req.user.userId});
    const result = await lecturer.viewPendingRequests();
    // console.log(result);
    if (result.connectionError){
        return res.status(500).json({
            msg:"connection error"
        });
    }

    if (result.action){
        return res.status(200).json({
            msg:result.data
        });
    }

    return res.status(400).json({
        msg:"Failed"
    })
}

exports.viewRequest=async (req,res)=>{
    const lecturer= new Lecturer({email:req.user.email,userType:req.user.userType,userId:req.user.userId});
    const result = await lecturer.viewRequest(req.params.reqId);
    // console.log(result);
    if (result.connectionError){
        return res.status(500).json({
            msg:"connection error"
        });
    }

    if (result.action){
        return res.status(200).json({
            msg:result.data
        });
    }

    return res.status(400).json({
        msg:"Failed"
    })
}