const express= require('express');
const authorization= require('../middlewares/authorization');
const TOCOntroller=require('../controllers/technicalOfficer');

const router=express.Router();

router.post("/addEquipment",authorization.tokenAuthorize,authorization.isTechnicalOfficerRole,TOCOntroller.addEquipment);
router.get("/getLabs",authorization.tokenAuthorize,authorization.isTechnicalOfficerRole,TOCOntroller.getLabs);
router.get("/getUserStats",authorization.tokenAuthorize,authorization.isTechnicalOfficerRole,TOCOntroller.getUserStats);
router.get("/getRequestStats",authorization.tokenAuthorize,authorization.isTechnicalOfficerRole,TOCOntroller.getRequestStats);
router.post("/removeEquipment/:eqId",authorization.tokenAuthorize,authorization.isTechnicalOfficerRole,TOCOntroller.removeEquipment);
router.post("/markAsNotUsable/:eqId",authorization.tokenAuthorize,authorization.isTechnicalOfficerRole,TOCOntroller.markAsNotUsable);
router.post("/markAvailable/:eqId",authorization.tokenAuthorize,authorization.isTechnicalOfficerRole,TOCOntroller.markAsAvailable);
router.post("/transferEquipment",authorization.tokenAuthorize,authorization.isTechnicalOfficerRole,TOCOntroller.transferEquipment);
router.post("/reportCondition",authorization.tokenAuthorize,authorization.isTechnicalOfficerRole,TOCOntroller.reportEquipCondition);
router.get("/viewInventory",authorization.tokenAuthorize,authorization.isTechnicalOfficerRole,TOCOntroller.viewInventory);
router.get("/viewAvailableEquips",authorization.tokenAuthorize,authorization.isTechnicalOfficerRole,TOCOntroller.viewAvailableLabEquips);
router.get("/viewBorrowedEquips",authorization.tokenAuthorize,authorization.isTechnicalOfficerRole,TOCOntroller.viewBorrowedEquipments);
router.get("/getEquipTypes",authorization.tokenAuthorize,authorization.isTechnicalOfficerRole,TOCOntroller.getEquipTypes);
router.get("/getDashboardDataM",authorization.tokenAuthorize,authorization.isTechnicalOfficerRole,TOCOntroller.getDashboardDataM);
router.get("/getUserDetails",authorization.tokenAuthorize,authorization.isTechnicalOfficerRole,TOCOntroller.getUserDetails);
router.post("/getBorrowDetails/",authorization.tokenAuthorize,authorization.isTechnicalOfficerRole,TOCOntroller.getBorrowDetails);
router.post("/acceptReturn",authorization.tokenAuthorize,authorization.isTechnicalOfficerRole,TOCOntroller.acceptReturns);

module.exports = router;