const Admin = require('../models/Admin');

exports.addStaff =async (req,res)=>{

    const admin =new Admin({email: req.user.email, userType:req.user.user_type,userId:req.user.userId});
    // Admin.addStaff(0001,"Sri","Thuva","sth@gmail.com","0771234567","lecturer")
    const result=await admin.addStaff(req.body.userId,req.body.firstName,req.body.lastName,req.body.email,req.body.contactNo,req.body.userType);
    console.log(result);

    if (result.validationError){
        return res.status(400).json({
            alert : {
                type : "danger",
                message:result.validationError.details[0].message
            }
        });
    }

    if (result.connectionError)
    return res.status(500).json({
      title: "Error",
      status: "500",
      message: "Internal Server Error",
    });

    if(result.action){
        return res.status(200).json({
            msg:"Success"
        });
    }

    return res.status(200).json({
        msg: "Failed"
    });
}

exports.removeUser=async (req,res)=>{
    const admin=new Admin({email:req.user.email,userType:req.user.user_type,userId:req.user.userId});
    const results=await admin.removeUser(req.body.userType,req.body.userId);

    if (results.connectionError){
        return res.status(500).json({  
            title: "Error",
            status: "500",
            message: "Internal Server Error",
        });
    }
    console.log(results.action);
    if (results.action){
        return res.status(200).json({
            msg:"Success"
        })
    }

    return res.status(200).json({
        msg:"Failed"
    })

}


exports.assignTO=async (req,res)=>{
    const admin=new Admin({email:req.user.email,userType:req.user.user_type,userId:req.user.userId});
    const result=await admin.assignTechnicalOfficer(req.body.labId,req.body.T_OId);

    if(result.connectionError){
        return res.status(500).json({
            title: "Error",
            status: "500",
            message: "Internal Server Error",
        })
    }
    if(result.validationError){
        return res.statuus(400).json({
            title: "Error",
            status: "400",
            message: "Validation Error",
        })
    }

    if(result.action){
        return res.status(200).json({
            title: "Success",
            status: "200",
            message: "Technical Officer assigned succesfully",
        });
    }

    return res.status(200).json({
        title: "Failed",
        status: "200",
        message: result.error,
    });
}

exports.addLaboratory=async (req,res)=>{
    const admin=new Admin({email:req.user.email,userType:req.user.user_type,userId:req.user.userId});
    const result=await admin.addLaboratory(req.body.labId,req.body.name,req.body.building,req.body.floor);
    console.log(result);
    if(result.connectionError){
        return res.status(500).json({
            title: "Error",
            status: "500",
            message: "Internal Server Error",
        })
    }
    if(result.validationError){
        return res.status(400).json({
            title: "Error",
            status: "400",
            message: "Validation Error",
        })
    }

    if(result.action){
        return res.status(200).json({
            title: "Success",
            status: "200",
            message: "Laboratory added succesfully",
        });
    }

    return res.status(200).json({
        title: "Failed",
        status: "200",
        message: "Try Again Later",
    });
}

exports.removeLaboratory=async (req,res)=>{
    const admin=new Admin({email:req.user.email,userType:req.user.userType,userId:req.user.userId});
    const result = await admin.removeLaboratory(req.body.labId);
    // console.log(result);
    if (result.connectionError){
        return res.status(500).json({
            title:"Error",
            status:"500",
            message:"Internal Error"
        });
    }

    if (result.action){
        return res.status(200).json({
            title:"Success",
            status:"200",
            message:"Laboratory is removed"
        });
    }

    return res.status(200).json({
        title:"Failed",
        status:"200",
        message:"Laboratory couldn't be deleted"
    })
}

exports.viewAssignedTO = async (req,res)=>{
    const admin=new Admin({email:req.user.email,userType:req.user.userType,userId:req.user.userId});
    const result=await admin.viewAssignedTechnicalOfficers();
   
    if (result.connectionError){
        return res.status(400).json({
            title:"Error",
            status:"400",
            message:"Internal Error"
        });
    }

    if (result.action){
        return res.status(200).json({
            title:"Success",
            status:"200",
            data:result.result
        });
    }

    return res.status(200).json({
        title:"Failed",
        status:"200",
        message:"Try again Later"
    })
}