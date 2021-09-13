const adminCotroller = require ("../controllers/admin");
const authorization= require("../middlewares/authorization");
const express = require ('express');
const router = express.Router();

router.post("/addStaff",authorization.tokenAuthorize,authorization.isAdminRole,adminCotroller.addStaff);
router.post("/removeUser",authorization.tokenAuthorize,authorization.isAdminRole,adminCotroller.removeUser);
module.exports =router;
