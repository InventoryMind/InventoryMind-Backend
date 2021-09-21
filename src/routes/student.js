const express=require('express');
const StudentController = require('../controllers/student');
const authorization= require('../middlewares/authorization');

const router=express.Router();

router.post('/register',authorization.isGuestUser,StudentController.register);
router.post('/makeBorrowRequest',authorization.tokenAuthorize,authorization.isStudentRole,StudentController.makeBorrowRequest);
router.post('/borrowTemporarily',authorization.tokenAuthorize,authorization.isStudentRole,StudentController.borrowTemporarily);

module.exports=router;