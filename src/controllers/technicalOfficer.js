const TechnicalOffcier = require("../models/TechnicalOffcier");
const Email = require("../utils/Email");


exports.changePassword=async (req,res)=>{
  // console.log(req.body)

  const TO=new TechnicalOffcier({email:req.user.email,userType:req.user.userType,userId:req.user.userId});
  const results=await TO.changePassword(req.body.currentPass,req.body.newPass);
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

exports.addEquipment = async (req, res) => {
  const to = new TechnicalOffcier({
    email: req.user.email,
    userType: req.user.userType,
    userId:req.user.userId
  });
//   console.log(req.user);
  const result = await to.addEquipment(
    req.body.name,
    req.body.typeId
  );

  if (result.validationError) {
    return res.status(400).json({
      msg: "validation error",
    });
  }

  if (result.connectionError) {
    return res.status(500).json({
      msg: "Connection erroe",
    });
  }

  if (result.action) {
    return res.status(200).json({
      eqId:result.eqId,
      msg: "Success",
    });
  }

  return res.status(400).json({
    msg: "Failed",
  });
};

exports.getLabs= async (req,res)=>{
  const TO= new TechnicalOffcier({email:req.user.mail,userType:req.user.userType,userId:req.user.userId});
  const result = await TO.getLabs();
  
    if (result.connectionError) {
      return res.status(500).json({
        msg: "Connection erroe",
      });
    }
    
    if (result.action) {
      return res.status(200).json({
        title:"Success",
        msg: result.data
      });
    }
  
    return res.status(400).json({
      msg: "Failed",
    });
}

exports.getUserStats= async (req,res)=>{
  const TO= new TechnicalOffcier({email:req.user.mail,userType:req.user.userType,userId:req.user.userId});
  const result = await TO.getUserStats();
  
    if (result.connectionError) {
      return res.status(500).json({
        msg: "Connection erroe",
      });
    }
    
    if (result.action) {
      return res.status(200).json({
        msg: result.data
      });
    }
  
    return res.status(400).json({
      msg: "Failed",
    });
}

exports.getRequestStats= async (req,res)=>{
  const TO= new TechnicalOffcier({email:req.user.mail,userType:req.user.userType,userId:req.user.userId});
  const result = await TO.getRequestStats();
  
    if (result.connectionError) {
      return res.status(500).json({
        msg: "Connection erroe",
      });
    }
    
    if (result.action) {
      return res.status(200).json({
        msg: result.data
      });
    }
  
    return res.status(400).json({
      msg: "Failed",
    });
}

exports.removeEquipment= async (req,res)=>{
    const TO= new TechnicalOffcier({email:req.user.mail,userType:req.user.userType,userId:req.user.userId});
    const result = await TO.removeEquipment(req.params.eqId);
    // console.log(req.params.eqId);
    if (result.validationError) {
        return res.status(400).json({
          msg: "validation error",
        });
      }
    
      if (result.connectionError) {
        return res.status(500).json({
          msg: "Connection erroe",
        });
      }
      
      if (result.notFound){
        return res.status(404).json({
          msg:"Eq Not Found",
          notInLab:true
        })
      }
      if (result.action) {
        return res.status(200).json({
          msg: "Success",
        });
      }
    
      return res.status(400).json({
        msg: "Failed",
      });
}

exports.markAsNotUsable= async (req,res)=>{
  const TO= new TechnicalOffcier({email:req.user.mail,userType:req.user.userType,userId:req.user.userId});
  const result = await TO.markAsNotUsable(req.params.eqId);
  // console.log(req.params.eqId);
  if (result.validationError) {
      return res.status(400).json({
        msg: "validation error",
      });
    }
  
    if (result.connectionError) {
      return res.status(500).json({
        msg: "Connection erroe",
      });
    }
    
    if (result.notFound){
      return res.status(404).json({
        msg:"Eq Not Found",
        notInLab:true
      })
    }
    if (result.action) {
      return res.status(200).json({
        msg: "Success",
      });
    }
  
    return res.status(400).json({
      msg: "Failed",
    });
}

exports.markAsAvailable= async (req,res)=>{
  const TO= new TechnicalOffcier({email:req.user.mail,userType:req.user.userType,userId:req.user.userId});
  const result = await TO.markAsAvailable(req.params.eqId);
  // console.log(req.params.eqId);
  if (result.validationError) {
      return res.status(400).json({
        msg: "validation error",
      });
    }
  
    if (result.connectionError) {
      return res.status(500).json({
        msg: "Connection erroe",
      });
    }
    
    if (result.notFound){
      return res.status(404).json({
        msg:"Eq Not Found",
        notInLab:true
      })
    }
    if (result.action) {
      return res.status(200).json({
        msg: "Success",
      });
    }
  
    return res.status(400).json({
      msg: "Failed",
    });
}

exports.transferEquipment = async (req,res)=>{
    const TO=new TechnicalOffcier({email:req.user.email,userType:req.user.userType,userId:req.user.userId});
    const result= await TO.transferEquipment(req.body.eqId,req.body.labId);

    if (result.validationError) {
        return res.status(400).json({
          msg: "validation error",
        });
      }
    
      if (result.connectionError) {
        return res.status(500).json({
          msg: "Connection error",
        });
      }
      
      if (result.notFound){
        return res.status(404).json({
          msg:'Equipment not found',
          notInLab:true
        })
      }

      if (result.action) {
        return res.status(200).json({
          msg: "Success",
        });
      }
    
      return res.status(400).json({
        msg: "Failed",
      });
}

exports.reportEquipCondition = async (req,res)=>{
    const TO=new TechnicalOffcier({email:req.user.email,userType:req.user.userType,userId:req.user.userId});
    const result= await TO.reportCondition(req.body.eqId,req.body.condition);
    // console.log(result);
    if (result.validationError) {
        return res.status(400).json({
          msg: "validation error",
        });
      }
    
      if (result.connectionError) {
        return res.status(500).json({
          msg: "Connection error",
        });
      }
    
      if (result.action) {
        return res.status(200).json({
          msg: "Success",
        });
      }
    
      return res.status(400).json({
        msg: "Failed",
      });
}

exports.viewInventory = async (req,res)=>{
  const TO=new TechnicalOffcier({email:req.user.email,userType:req.user.userType,userId:req.user.userId});
  const result= await TO.viewInventory();
  // console.log(result);
     
    if (result.connectionError) {
      return res.status(500).json({
        msg: "Connection error",
      });
    }
  
    if (result.action) {
      return res.status(200).json({
        msg: "Success",
        data:result.data
      });
    }
  
    return res.status(400).json({
      msg: "Failed",
    });
}

exports.viewBorrowedEquipments = async (req,res)=>{
  const TO=new TechnicalOffcier({email:req.user.email,userType:req.user.userType,userId:req.user.userId});
  const result= await TO.viewBorrowedEquipments();
  // console.log(result);
     
    if (result.connectionError) {
      return res.status(500).json({
        msg: "Connection error",
      });
    }
  
    if (result.action) {
      return res.status(200).json({
        msg: "Success",
        data:result.data
      });
    }
  
    return res.status(400).json({
      msg: "Failed",
    });
}

exports.viewAvailableLabEquips = async (req,res)=>{
    const TO=new TechnicalOffcier({email:req.user.email,userType:req.user.userType,userId:req.user.userId});
    const result= await TO.viewAvailableLabEquipment();
    // console.log(result);
       
      if (result.connectionError) {
        return res.status(500).json({
          msg: "Connection error",
        });
      }
    
      if (result.action) {
        return res.status(200).json({
          msg: "Success",
          data:result.data
        });
      }
    
      return res.status(400).json({
        msg: "Failed",
      });
}

exports.getEquipTypes = async (req,res)=>{
    const TO=new TechnicalOffcier({email:req.user.email,userType:req.user.userType,userId:req.user.userId});
    const result= await TO.getEquipTypes();
    // console.log(result);
       
      if (result.connectionError) {
        return res.status(400).json({
          msg: "Connection error",
        });
      }
    
      if (result.action) {
        return res.status(200).json({
          msg: "Success",
          data:result.data
        });
      }
    
      return res.status(400).json({
        msg: "Failed",
      });
}

exports.getDashboardDataM=async (req,res)=>{
  const TO= new TechnicalOffcier({email:req.user.email,userType:req.user.userType,userId:req.user.userId});
  const result = await TO.getDashboardDataMob();
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
  const TO= new TechnicalOffcier({email:req.user.email,userType:req.user.userType,userId:req.user.userId});
  const result=await TO.getUserDetails();

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

exports.getBorrowDetails=async (req,res)=>{
  const TO= new TechnicalOffcier({email:req.user.email,userType:req.user.userType,userId:req.user.userId});
  const result = await TO.getBorrowDetails(req.body.borrowId,req.body.type);
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

exports.acceptReturns = async (req,res)=>{
  const TO=new TechnicalOffcier({email:req.user.email,userType:req.user.userType,userId:req.user.userId});
  const result= await TO.acceptReturns(req.body.borrowId,req.body.type);
  // console.log(result);
  if (result.validationError) {
      return res.status(400).json({
        msg: "validation error",
      });
    }
  
    if (result.connectionError) {
      return res.status(500).json({
        msg: "Connection error",
      });
    }
  
    if (result.action) {
      return res.status(200).json({
        msg: "Success",
      });
    }
  
    return res.status(400).json({
      msg: "Failed",
    });
}