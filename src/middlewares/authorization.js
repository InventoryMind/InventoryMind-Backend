const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

exports.tokenAuthorize = (req, res, next) => {
  const token = req.cookies["auth-token"];
  if (!token)
    return res.status(401).json({
      title: "Error",
      status: "401",
      message: "Access Denied. No token provided",
    });

  try {
    const payload = jwt.verify(token, process.env.jwtPrivateKey);
    req.user = payload;
    // console.log(req.user["user_type"]);
    next();
  } catch (ex) {
    res.status(400).json({
      title: "Error",
      status: "400",
      message: "Invalid token",
    });
  }
};

exports.resetTokenAuthorize = (req, res, next) => {
  const token = req.cookies["reset-token"];
  if (!token)
    return res.status(401).json({
      title: "Error",
      status: "401",
      message: "Access Denied. No token provided",
    });

  try {
    const payload = jwt.verify(token, process.env.jwtPrivateKey);
    req.user = payload;
    // console.log(req.user["user_type"]);
    next();
  } catch (ex) {
    res.status(400).json({
      title: "Error",
      status: "400",
      message: "Invalid token",
    });
  }
};

exports.isGuestUser = (req, res, next) => {
  const token = req.cookies["auth-token"];
  if (!token) {
    next();
  } else {
    try {
      const payload = jwt.verify(token, process.env.jwtPrivateKey);
      // console.log(payload);
      req.user = payload;
      res.json(req.user);
    } catch (ex) {
      res.status(400).json({
        title: "Error",
        status: "400",
        message: "Invalid token",
      });
    }
  }
};

exports.isAdminRole = (req, res, next) => {
  if (req.user.userType === "administrator") {
    next();
  } else {
    res.status(403).json({
      title: "Error",
      status: "403",
      message: "Forbidden",
    });
  }
};

exports.isLecturerRole = (req, res, next) => {
    if (req.user.userType === "lecturer") {
      next();
    } else {
      res.status(403).json({
        title: "Error",
        status: "403",
        message: "Forbidden",
      });
    }
  };

  exports.isTechnicalOfficerRole = (req, res, next) => {
    if (req.user.userType === "technical_officer") {
      next();
    } else {
      res.status(403).json({
        title: "Error",
        status: "403",
        message: "Forbidden",
      });
    }
  };

  exports.isStudentRole = (req, res, next) => {
    if (req.user["userType"] === "student") {
      next();
    } else {
      res.status(403).json({
        title: "Error",
        status: "403",
        message: "Forbidden",
      });
    }
  };

exports.isAlreadyLogin = (req, res, next) => {
  const token = req.cookies["auth-token"];

  if (!token) {
    next();
  } else {
    const payload = jwt.verify(token, process.env.jwtPrivateKey);
    let data={userId:payload.userId,email:payload.email,firstName:payload.firstName,lastName:payload.lastName};
    res.status(400).json({
      title: "Error",
      status: "400",
      message: "You have already logged in",
      token:token
    });
  }
};
