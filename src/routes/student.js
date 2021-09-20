const express=require('express');
const StudentController = require('../controllers/student');
const authorization= require('../middlewares/authorization');

const router=express.Router();

router.post('/register',StudentController.register);
router.post('/makeBorrowRequest',authorization.tokenAuthorize,authorization.isStudentRole,StudentController.makeBorrowRequest);

module.exports=router;