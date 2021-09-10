const authController = require("../controllers/auth");
const authorization = require("../middlewares/authorization");
const express = require("express");
const router = express.Router();

router.post("/login", authorization.isAlreadyLogin, authController.login);
router.get("/logout",authorization.tokenAuthorize,authController.logout);

module.exports=router;