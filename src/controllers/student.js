const Student= require('../models/Student');


exports.register=async (req,res)=>{
    const student= new Student({email:req.body.email,userType:req.body.userType});
    const result = await student.register(req.body.userId,req.body.firstName,req.body.lastName,req.body.email,req.body.contactNo);

    if (result.validationError){
        return res.status(400).json({
            title: "Error",
            status: "400",
            message: "Validation Error",
        });
    }

    if (result.connectionError){
        return res.status(500).json({
            title:"Error",
            status:"500",
            message:"Internal Error"
        });
    }
    console.log(result)
    if (result.action){
        return res.status(200).json({
            msg:"Success"
        });
    }

    return res.status(400).json({
        msg:"Failed"
    });
}

exports.makeBorrowRequest=async (req,res)=>{
    const student= new Student({email:req.user.email,userType:req.user.userType,userId:req.user.userId});
    const result = await student.makeBorrowRequest(req.body.lecturerId,req.body.dateOfBorrowing,req.body.dateOfReturning,req.body.reason,req.body.eqIds);

    if (result.validationError){
        return res.status(400).json({
            msg:"Validaiton error"
        });
    }

    if (result.connectionError){
        return res.status(500).json({
            msg:"connection error"
        });
    }

    if (result.action){
        return res.status(200).json({
            msg:"Success"
        });
    }

    return res.status(400).json({
        msg:"Failed"
    })
}


exports.borrowTemporarily=async (req,res)=>{
    const student= new Student({email:req.user.email,userType:req.user.userType,userId:req.user.userId});
    const result = await student.borrowTemporarily(req.body.reason,req.body.eqIds);
    console.log(result);
    if (result.validationError){
        return res.status(400).json({
            msg:"Validaiton error"
        });
    }

    if (result.connectionError){
        return res.status(500).json({
            msg:"connection error"
        });
    }

    if (result.action){
        return res.status(200).json({
            msg:"Success"
        });
    }

    return res.status(400).json({
        msg:"Failed"
    })
}


exports.getDashboardDataM=async (req,res)=>{
    const student= new Student({email:req.user.email,userType:req.user.userType,userId:req.user.userId});
    const result = await student.getDashboardDataM();
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

exports.viewAllRequest=async (req,res)=>{
    const student= new Student({email:req.user.email,userType:req.user.userType,userId:req.user.userId});
    const result = await student.viewAllRequest();
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
    const student= new Student({email:req.user.email,userType:req.user.userType,userId:req.user.userId});
    const result = await student.viewRequest(req.params.reqId);
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

exports.viewBorrowedHistory=async (req,res)=>{
    const student= new Student({email:req.user.email,userType:req.user.userType,userId:req.user.userId});
    const result = await student.viewBorrowedHistory();
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

exports.viewBorrowDetails=async (req,res)=>{
    const student= new Student({email:req.user.email,userType:req.user.userType,userId:req.user.userId});
    const result = await student.viewBorrowDetails(req.body.borrowId,req.body.type);
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

exports.getUserDetails = async(req,res)=>{
    const student= new Student({email:req.user.email,userType:req.user.userType,userId:req.user.userId});
    const result=await student.getUserDetails();

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

exports.getLabs = async(req,res)=>{
    const student= new Student({email:req.user.email,userType:req.user.userType,userId:req.user.userId});
    const result=await student.getLabs();
    console.log(req.body)
    if (result.connectionError){
        return res.status(500).json({
            title:"Error",
            msg:"connection error"
        });
    }

    if (result.action){
        return res.status(200).json({
            title:"Success",
            msg:result.result
        });
    }

    return res.status(400).json({
        title:"Failed",
        msg:"Failed"
    });
}

exports.getLecturers = async(req,res)=>{
    const student= new Student({email:req.user.email,userType:req.user.userType,userId:req.user.userId});
    const result=await student.getLecturers();
    console.log(req.body)
    if (result.connectionError){
        return res.status(500).json({
            title:"Error",
            msg:"connection error"
        });
    }

    if (result.action){
        return res.status(200).json({
            title:"Success",
            msg:result.result
        });
    }

    return res.status(400).json({
        title:"Failed",
        msg:"Failed"
    });
}