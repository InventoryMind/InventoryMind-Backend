const authController = require("../controllers/auth");
const authorization = require("../middlewares/authorization");
const express = require("express");
const router = express.Router();

router.post("/login", authorization.isAlreadyLogin, authController.login);
router.get("/logout",authorization.tokenAuthorize,authController.logout);
router.post("/forgotPassword",authorization.isAlreadyLogin,authController.forgotPassword);
router.post("/resendResetCode",authorization.resetTokenAuthorize,authController.resendForgotPassword);
router.post("/resetPassword",authorization.resetTokenAuthorize,authController.resetPassword);

module.exports=router;