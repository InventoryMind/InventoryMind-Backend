const express= require('express');
const authorization= require('../middlewares/authorization');
const TOCOntroller=require('../controllers/technicalOfficer');

const router=express.Router();

router.post("/addEquipment",authorization.tokenAuthorize,authorization.isTechnicalOfficerRole,TOCOntroller.addEquipment);

module.exports = router;