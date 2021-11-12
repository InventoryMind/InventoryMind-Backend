const adminCotroller = require ("../controllers/admin");
const authorization= require("../middlewares/authorization");
const express = require ('express');
const router = express.Router();

router.post("/changePass",authorization.tokenAuthorize,authorization.isAdminRole,adminCotroller.changePassword);
router.post("/addStaff",authorization.tokenAuthorize,authorization.isAdminRole,adminCotroller.addStaff);
router.post("/removeUser",authorization.tokenAuthorize,authorization.isAdminRole,adminCotroller.removeUser);
router.post("/addLaboratory",authorization.tokenAuthorize,authorization.isAdminRole,adminCotroller.addLaboratory);
router.post("/removeLaboratory",authorization.tokenAuthorize,authorization.isAdminRole,adminCotroller.removeLaboratory);
router.post("/assignTO",authorization.tokenAuthorize,authorization.isAdminRole,adminCotroller.assignTO);
router.get("/viewAssignedTO",authorization.tokenAuthorize,authorization.isAdminRole,adminCotroller.viewAssignedTO);
router.get("/getUserDetails",authorization.tokenAuthorize,authorization.isAdminRole,adminCotroller.getUserDetails);
router.get("/viewLab",authorization.tokenAuthorize,authorization.isAdminRole,adminCotroller.viewLaboratories);
router.get("/viewUsers/:userType",authorization.tokenAuthorize,authorization.isAdminRole,adminCotroller.viewUsers);
router.get("/getBuildings",authorization.tokenAuthorize,authorization.isAdminRole,adminCotroller.getBuildings);
router.post("/addEquipType",authorization.tokenAuthorize,authorization.isAdminRole,adminCotroller.addEquipType);
router.get("/getTOs",authorization.tokenAuthorize,authorization.isAdminRole,adminCotroller.getTOs);
router.get("/getLabs",authorization.tokenAuthorize,authorization.isAdminRole,adminCotroller.getLabs);
router.get("/getDashboardData",authorization.tokenAuthorize,authorization.isAdminRole,adminCotroller.getDashboardData);
router.get("/getRequestStats",authorization.tokenAuthorize,authorization.isAdminRole,adminCotroller.getRequestStats);
router.get("/getUserStats",authorization.tokenAuthorize,authorization.isAdminRole,adminCotroller.getUserStats);
router.get("/getEquipStats",authorization.tokenAuthorize,authorization.isAdminRole,adminCotroller.getEquipStats);
// router.get("/getRequestStats/:labId",authorization.tokenAuthorize,authorization.isTechnicalOfficerRole,adminCotroller.getRequestStats);
// router.get("/getEquipStats/:labId",authorization.tokenAuthorize,authorization.isTechnicalOfficerRole,adminCotroller.getEquipStats);
// router.get("/getUserStats",authorization.tokenAuthorize,authorization.isTechnicalOfficerRole,adminCotroller.getUserStats);



module.exports =router;
