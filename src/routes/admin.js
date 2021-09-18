const adminCotroller = require ("../controllers/admin");
const authorization= require("../middlewares/authorization");
const express = require ('express');
const router = express.Router();

router.post("/addStaff",authorization.tokenAuthorize,authorization.isAdminRole,adminCotroller.addStaff);
router.post("/removeUser",authorization.tokenAuthorize,authorization.isAdminRole,adminCotroller.removeUser);
router.post("/addLaboratory",authorization.tokenAuthorize,authorization.isAdminRole,adminCotroller.addLaboratory);
router.post("/removeLaboratory",authorization.tokenAuthorize,authorization.isAdminRole,adminCotroller.removeLaboratory);
router.post("/assignTO",authorization.tokenAuthorize,authorization.isAdminRole,adminCotroller.assignTO);

module.exports =router;
