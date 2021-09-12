const e = require("express");
const Joi = require("joi");
const User = require("./User");

class Admin extends User{
    constructor(data){
        super(data);
    }

   async addLaboratory(id,name,building,floor,technicalOfficerId,eqIds){
        const validateData=Joi.object(
            {   id:Joi.string().max(10).required(),
                name:Joi.string().max(20).required(),
                building:Joi.string().max(20).required(),
                floor: Joi.string().max(30).email().required(),
                technicalOfficerId:Joi.string().min(10).max(10).required(),
                eqIds:Joi.string().max(20).required()
            }).validate({
                id:id,
                name:name,
                building:building,
                floor:floor,
                technicalOfficerId:technicalOfficerId,
                eqIds:eqIds
            });

        if (this._database.connectionError){
            return new Promise((resolve)=>resolve({connectionError:true}));
        }

        const result=await this._database.insert("laboratory",[id,name])
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

    async addStaff(userId,firstName,lastName,email,contactNo,staffType){
        console.log("before valid ");
        const validateData=Joi.object(
            {   userId:Joi.string().max(10).required(),
                firstName:Joi.string().max(20).required(),
                lastName:Joi.string().max(20).required(),
                email: Joi.string().max(30).email().required(),
                contactNo:Joi.string().min(10).max(10).required(),
                staffType:Joi.string().max(20).required()
            }).validate({
                userId:userId,
                firstName:firstName,
                lastName:lastName,
                email:email,
                contactNo:contactNo,
                staffType:staffType
            });

        if(validateData.error){
            return new Promise((resolve)=>resolve({validationError:validateData.error}));
        }
        // console.log(validateData);
        if(this._database.connectionError){
            return new Promise((resolve)=>resolve({connectionError:true}));
        }
        let password=firstName+'@'+userId;
        const values=[userId,firstName,lastName,email,password,contactNo,true];
        // console.log(values);
        //console.log([staffType,[userId,firstName,lastName,email,password,contactNo,true]]);
        const result=await this._database.insert(staffType,values);
        //console.log(result);
        if (result.error){
            return new Promise((resolve)=>resolve({action:false}))
        }

        return new Promise((resolve)=>resolve({action:true}));

    }

    async removeUser(userType,userId){
        if(this._database.connectionError){
            return new Promise((resolve)=>resolve({connectionError:true}));
        }

        const result=await this._database.delete(userType,["user_id","=",userId]);
        console.log(result);

        if (result.error){
            return new Promise((resolve)=>resolve({action:false}));
        }

        return new Promise ((resolve)=>resolve({action:true}));
    }

    async assignTechnicalOfficer(labId,T_OId){
        const validateData=Joi.object({
            labId:Joi.string().max(3).required(),
            T_OId:Joi.string().max(10).required()
        }).validate({
            labId:labId,
            T_OId:T_OId
        });

        if (validateData.validationError){
            return new Promise((resolve)=>{
                validationError:validateData.error
            });
        }

        if (this._database.connectionError){
            return new Promise((resolve)=>resolve({connectionError:true}));
        }

        const result=await this._database.insert("assigned_t_o",[T_OId,labId]);

        console.log(result);

        if(result.error){
            return new Promise((resolve)=>resolve({
                action:false
            }));
        }

        return new Promise((resolve)=>resolve({action:true}));
    }

    viewAssignedTechnicalOfficers(){

    }

    viewReports(){

    }

}

module.exports = Admin;