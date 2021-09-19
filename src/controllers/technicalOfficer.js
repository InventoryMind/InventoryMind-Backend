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
