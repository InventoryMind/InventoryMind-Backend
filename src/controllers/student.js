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

    if (result.action){
        res.status(200).json({
            msg:"Success"
        });
    }

    return res.status(201).json({
        msg:"Failed"
    });
}

exports.makeBorrowRequest=async (req,res)=>{
    const student= new Student({email:req.user.email,userType:req.user.userType,userId:req.user.userId});
    const result = await student.makeBorrowRequest(req.body.studentId,req.body.lecturerId,req.body.dateOfBorrowing,req.body.dateOfReturning,req.body.reason,req.body.eqIds);

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

    return res.status(401).json({
        msg:"Failed"
    })
}