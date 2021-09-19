const User = require("./User");
const Joi=require('joi').extend(require('@joi/date'));
const bcrypt=require('bcrypt');

class Student extends User{
    constructor(data){
        super(data);
    }

    async register(userId,firstName,lastName,email,contactNo){
        const validateData=Joi.object(
            {   userId:Joi.string().max(10).required(),
                firstName:Joi.string().max(20).required(),
                lastName:Joi.string().max(20).required(),
                email: Joi.string().max(30).email().required(),
                contactNo:Joi.string().min(10).max(10).required()
            }).validate({
                userId:userId,
                firstName:firstName,
                lastName:lastName,
                email:email,
                contactNo:contactNo
            });
            console.log(validateData);
        if(validateData.error){
            return new Promise((resolve)=>resolve({validationError:validateData.error}));
        }
        // console.log(validateData);
        if(this._database.connectionError){
            return new Promise((resolve)=>resolve({connectionError:true}));
        }
        let password=firstName+'@'+userId;
         //encrypt the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        password = hashedPassword;

        const values=[userId,firstName,lastName,email,password,contactNo,true];
        // console.log(values);
        //console.log([staffType,[userId,firstName,lastName,email,password,contactNo,true]]);
        const result=await this._database.insert('student',null,values);
        console.log(result);

        if (result.error){
            return new Promise((resolve)=>resolve({action:false}))
        }
        return new Promise((resolve)=>resolve({action:true}));
    }

    async makeBorrowRequest(studentId,lecturerId,dateOfBorrowing,dateOfReturning,reason,eqIds){
        const validateData=Joi.object(
            {   studentId:Joi.string().max(10).required(),
                lecturerId:Joi.string().max(10).required(),
                dateOfBorrowing:Joi.date().format("DD/MM/YYYY").required(),
                dateOfReturning: Joi.date().format("DD/MM/YYYY").required(),
                reason:Joi.string().max(30).required(),
                eqIds:Joi.array().items(Joi.string().max(20)).required()
            }).validate({
                studentId:studentId,
                lecturerId:lecturerId,
                dateOfBorrowing:dateOfBorrowing,
                dateOfReturning:dateOfReturning,
                reason:reason,
                eqIds:eqIds
            });
    
        if(validateData.error){
            return new Promise((resolve)=>resolve({validationError:validateData.error}));
        }
        // console.log(validateData);
        if(this._database.connectionError){
            return new Promise((resolve)=>resolve({connectionError:true}));
        }
        // const values=[req_id,userId,firstName,lastName,email,password,contactNo,true];
        // console.log(values);
        //console.log([staffType,[userId,firstName,lastName,email,password,contactNo,true]]);
        const result=await this._database.makeRequest(studentId,lecturerId,dateOfBorrowing,dateOfReturning,reason,eqIds);
        console.log(result);

        if (result.error){
            return new Promise((resolve)=>resolve({action:false}))
        }

        return new Promise((resolve)=>resolve({action:true}));
    }

    borrowTemporarily(){

    }

    checkRequestStatus(){

    }

    viewBorrowedHistory(){

    }
    
}

module.exports = Student;