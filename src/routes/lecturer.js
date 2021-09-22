const express= require('express');
const lecturerController=require('../controllers/lecturer');
const authorization=require('../middlewares/authorization');

const router=express.Router();

router.post("/approve/:reqId",authorization.tokenAuthorize,authorization.isLecturerRole,lecturerController.approve);
router.post("/reject/:reqId",authorization.tokenAuthorize,authorization.isLecturerRole,lecturerController.reject);
router.get("/getDashboardDataM",authorization.tokenAuthorize,authorization.isLecturerRole,lecturerController.getDashboardDataMob);
module.exports=router;