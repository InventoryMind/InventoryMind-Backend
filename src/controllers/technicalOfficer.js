const TechnicalOffcier = require("../models/TechnicalOffcier");

exports.addEquipment = async (req, res) => {
  const to = new TechnicalOffcier({
    email: req.user.email,
    userType: req.user.userType,
  });
  const result = await to.addEquipment(
    req.body.eqId,
    req.body.name,
    req.body.labId,
    req.body.type,
    req.body.brand
  );

  if (result.validationError) {
    return res.json({
      msg: "validation error",
    });
  }

  if (result.connectionError) {
    return res.json({
      msg: "Connection erroe",
    });
  }

  if (result.action) {
    return res.json({
      msg: "Success",
    });
  }

  return res.json({
    msg: "Failed",
  });
};

exports.removeEquipment= async (req,res)=>{
    const TO= new TechnicalOffcier({email:req.user.mail,userType:req.user.userType});
    const result = await TO.removeEquipment(req.params.eqId);
    // console.log(req.params.eqId);
    if (result.validationError) {
        return res.json({
          msg: "validation error",
        });
      }
    
      if (result.connectionError) {
        return res.json({
          msg: "Connection erroe",
        });
      }
    
      if (result.action) {
        return res.json({
          msg: "Success",
        });
      }
    
      return res.json({
        msg: "Failed",
      });
}

exports.transferEquipment = async (req,res)=>{
    const TO=new TechnicalOffcier({email:req.user.email,userType:req.user.userType});
    const result= await TO.transferEquipment(req.body.eqId,req.body.labId);

    if (result.validationError) {
        return res.json({
          msg: "validation error",
        });
      }
    
      if (result.connectionError) {
        return res.json({
          msg: "Connection error",
        });
      }
    
      if (result.action) {
        return res.json({
          msg: "Success",
        });
      }
    
      return res.json({
        msg: "Failed",
      });
}

exports.reportEquipCondition = async (req,res)=>{
    const TO=new TechnicalOffcier({email:req.user.email,userType:req.user.userType});
    const result= await TO.reportCondition(req.body.eqId,req.body.condition);
    console.log(result);
    if (result.validationError) {
        return res.json({
          msg: "validation error",
        });
      }
    
      if (result.connectionError) {
        return res.json({
          msg: "Connection error",
        });
      }
    
      if (result.action) {
        return res.json({
          msg: "Success",
        });
      }
    
      return res.json({
        msg: "Failed",
      });
}

exports.viewAvailableLabEquips = async (req,res)=>{
    const TO=new TechnicalOffcier({email:req.user.email,userType:req.user.userType});
    const result= await TO.viewAvailableLabEquipment();
    console.log(result);
       
      if (result.connectionError) {
        return res.json({
          msg: "Connection error",
        });
      }
    
      if (result.action) {
        return res.json({
          msg: "Success",
          data:result.data
        });
      }
    
      return res.json({
        msg: "Failed",
      });
}