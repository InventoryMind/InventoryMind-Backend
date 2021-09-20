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

    async borrowTemporarily(reason,eqIds){
        const validateData=Joi.object(
            {   reason:Joi.string().max(30).required(),
                eqIds:Joi.array().items(Joi.string().max(20)).required()
            }).validate({
                reason:reason,
                eqIds:eqIds
            });
        // console.log(validateData);
        if(validateData.error){
            return new Promise((resolve)=>resolve({validationError:validateData.error}));
        }
        if(this._database.connectionError){
            return new Promise((resolve)=>resolve({connectionError:true}));
        }
        let availability=await this.checkItemAvailability(eqIds);
        // console.log(availability);
        if (!availability.available){
            return new Promise((resolve)=>{
                resolve({action:false,msg:"Item not available",data:availability.data});
            });
        }
        let date=new Date();
        var dateOfBorrowing=date.getDate()+'/'+(parseInt(date.getMonth())+1)+'/'+date.getFullYear();
        const result=await this._database.borrowTemporarily(this._u_id,dateOfBorrowing,reason,eqIds);
        console.log(result);

        if (result.error){
            return new Promise((resolve)=>resolve({action:false}))
        }

        return new Promise((resolve)=>resolve({action:true}));
    }

    checkRequestStatus(){

    }

    viewBorrowedHistory(){

    }

    async checkItemAvailability(eqIds){
        // console.log("check called")
        let isItemAvailable = async (eqId)=>{
            const result=await this._database.readSingleTable("equipment",null,["eq_id","=",eqId]);
            // console.log(result);
            if (result.error || result.result.rowCount==0){
            return new Promise((resolve)=>{
                resolve({
                    error:true
                })
            });
            }
            return new Promise((resolve)=>{
                let state=["available","requested","temporarily borrowed","borrowed","not usable","removed"];
                resolve({eqId:result.result.rows[0].eq_id,state:state[parseInt(result.result.rows[0].state)]});
            });
        }
        
        
        // console.log(result);
        let availability=[];
        let available=true;
        for (let i=0;i<eqIds.length;i++){
            availability[i]=await isItemAvailable(eqIds[i]);
            available=available && availability[i].state==="available";
            // console.log(available);
        }
        // console.log(availability);
        return new Promise((resolve)=>{
            resolve({
                data:availability,
                available:available
            });
        });
    }
    
}

module.exports = Student;