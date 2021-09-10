const e = require("express");
const Joi = require("joi");
const User = require("./User");

class Admin extends User{
    constructor(data){
        super(data);
    }

    addLaboratory(id,name,building,floor,technicalOfficerId,eqIds){
        
    }

    async removeLaboratory(labId){
        if (this._database.connectionError){
            return new Promise((resolve)=>resolve({connectionError:true}));
        }

        const result=await this._database.delete("laboratory",["lab_id","=",labId]);

        if (result.error){
            return new Promise((resolve)=>resolve({action:false}));
        }

        return new Promise((resolve)=>resolve({action:true}));
    }

    addStaffMember(userId,firstName,lastName,email,contactNo,staffType){
        const validateData=Joi.object(
            {   userId:Joi.string().max(10).required(),
                firstName:Joi.string().max(20).required(),
                lastName:Joi.ref('firstName'),
                email: Joi.string().max(30).email().required(),
                contactNo:Joi.num(10).max().required()
            }).validate({
                userId:userId,
                firstName:firstName,
                lastName:lastName,
                email:email,
                contactNo:contactNo
            });
        if(validateData.error){
            return new Promise((resolve)=>resolve({validationError:validateData.error}));
        }

        if(this._database.connectionError){
            return new Promise((resolve)=>resolve({connectionError:true}));
        }
        let password=firstName+'@'+userId;
        const result=await this._database.insert(staffType,[userId,firstName,lastName,email,password,contactNo,true]);

        if (result.result.error){
            return new Promise((resolve)=>resolve({action:false}))
        }

        return new Promise((resolve)=>resolve({action:true}));

    }

    removUser(){

    }

    assignTechnicalOfficer(){

    }

    viewAssignedTechnicalOfficers(){

    }

    viewReports(){

    }

}

module.exports = Admin;