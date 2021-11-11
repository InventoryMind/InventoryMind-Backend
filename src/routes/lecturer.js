const express= require('express');
const lecturerController=require('../controllers/lecturer');
const authorization=require('../middlewares/authorization');

const router=express.Router();

router.post("/changePass",authorization.tokenAuthorize,authorization.isLecturerRole,lecturerController.changePassword);
router.post("/approve/:reqId",authorization.tokenAuthorize,authorization.isLecturerRole,lecturerController.approve);
router.post("/reject/:reqId",authorization.tokenAuthorize,authorization.isLecturerRole,lecturerController.reject);
router.get("/getDashboardDataM",authorization.tokenAuthorize,authorization.isLecturerRole,lecturerController.getDashboardDataMob);
router.get("/getUserDetails",authorization.tokenAuthorize,authorization.isLecturerRole,lecturerController.getUserDetails);
router.get("/viewAllRequest",authorization.tokenAuthorize,authorization.isLecturerRole,lecturerController.viewAllRequests);
router.get("/viewAcceptedRequests",authorization.tokenAuthorize,authorization.isLecturerRole,lecturerController.viewAcceptedRequest);
router.get("/viewRejectedRequests",authorization.tokenAuthorize,authorization.isLecturerRole,lecturerController.viewRejectedRequest);
router.get("/viewPendingRequest",authorization.tokenAuthorize,authorization.isLecturerRole,lecturerController.viewPendingRequest);
router.get("/viewRequest/:reqId",authorization.tokenAuthorize,authorization.isLecturerRole,lecturerController.viewRequest);

module.exports=router;