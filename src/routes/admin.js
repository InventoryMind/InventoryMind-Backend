const adminCotroller = require ("../controllers/admin");
const authorization= require("../middlewares/authorization");
const express = require ('express');
const router = express.Router();

router.post("/addStaff",authorization.tokenAuthorize,authorization.isAdminRole,adminCotroller.addStaff);
router.post("/removeUser",authorization.tokenAuthorize,authorization.isAdminRole,adminCotroller.removeUser);
router.post("/addLaboratory",authorization.tokenAuthorize,authorization.isAdminRole,adminCotroller.addLaboratory);
router.post("/removeLaboratory",authorization.tokenAuthorize,authorization.isAdminRole,adminCotroller.removeLaboratory);
router.post("/assignTO",authorization.tokenAuthorize,authorization.isAdminRole,adminCotroller.assignTO);
router.get("/viewAssignedTO",authorization.tokenAuthorize,authorization.isAdminRole,adminCotroller.viewAssignedTO);
router.get("/getUserDetails",authorization.tokenAuthorize,authorization.isAdminRole,adminCotroller.getUserDetails);
router.get("/viewLab",authorization.tokenAuthorize,authorization.isAdminRole,adminCotroller.viewLaboratories);
router.get("/viewUsers/:userType",authorization.tokenAuthorize,authorization.isAdminRole,adminCotroller.viewUsers);

module.exports =router;
