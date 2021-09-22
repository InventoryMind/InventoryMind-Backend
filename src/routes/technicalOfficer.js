const express= require('express');
const authorization= require('../middlewares/authorization');
const TOCOntroller=require('../controllers/technicalOfficer');

const router=express.Router();

router.post("/addEquipment",authorization.tokenAuthorize,authorization.isTechnicalOfficerRole,TOCOntroller.addEquipment);
router.post("/removeEquipment/:eqId",authorization.tokenAuthorize,authorization.isTechnicalOfficerRole,TOCOntroller.removeEquipment);
router.post("/transferEquipment",authorization.tokenAuthorize,authorization.isTechnicalOfficerRole,TOCOntroller.transferEquipment);
router.post("/reportCondition",authorization.tokenAuthorize,authorization.isTechnicalOfficerRole,TOCOntroller.reportEquipCondition);
router.get("/viewAvailableEquips",authorization.tokenAuthorize,authorization.isTechnicalOfficerRole,TOCOntroller.viewAvailableLabEquips);
router.get("/getEquipTypes",authorization.tokenAuthorize,authorization.isTechnicalOfficerRole,TOCOntroller.getEquipTypes);

module.exports = router;