const jwt = require("jsonwebtoken");
const config = require("config");

exports.tokenAuthorize = (req, res, next) => {
  const token = req.cookies["auth-token"];
  if (!token)
    return res.status(401).json({
      title: "Error",
      status: "401",
      message: "Access Denied. No token provided",
    });

  try {
    const payload = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = payload;
    console.log(req.user["user_type"]);
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
      const payload = jwt.verify(token, config.get("jwtPrivateKey"));
      console.log(payload);
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
  if (req.user.user_type === "administrator") {
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
    if (req.user.user_type === "lecturer") {
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
    if (req.user.user_type === "technical_officer") {
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
    if (req.user["user_type"] === "student") {
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
  if (!req.cookies["auth-token"]) {
    next();
  } else {
    res.status(400).json({
      title: "Error",
      status: "400",
      message: "You have already logged in",
    });
  }
};
