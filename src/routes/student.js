const express=require('express');
const StudentController = require('../controllers/student');
const authorization= require('../middlewares/authorization');

const router=express.Router();

router.post('/register',authorization.isGuestUser,StudentController.register);
router.post('/makeBorrowRequest',authorization.tokenAuthorize,authorization.isStudentRole,StudentController.makeBorrowRequest);
router.post('/borrowTemporarily',authorization.tokenAuthorize,authorization.isStudentRole,StudentController.borrowTemporarily);
router.get('/getDashboardDataM',authorization.tokenAuthorize,authorization.isStudentRole,StudentController.getDashboardDataM);
router.get('/getUserDetails',authorization.tokenAuthorize,authorization.isStudentRole,StudentController.getUserDetails);
router.get('/viewAllRequest',authorization.tokenAuthorize,authorization.isStudentRole,StudentController.viewAllRequest);
router.get('/viewRequest/:reqId',authorization.tokenAuthorize,authorization.isStudentRole,StudentController.viewRequest);
router.get('/viewBorrowedHistory',authorization.tokenAuthorize,authorization.isStudentRole,StudentController.viewBorrowedHistory);
router.post('/viewBorrow',authorization.tokenAuthorize,authorization.isStudentRole,StudentController.viewBorrowDetails);


module.exports=router;