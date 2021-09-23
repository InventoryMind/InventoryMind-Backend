const e = require("express");
const Joi = require("joi");
const User = require("./User");
const bcrypt=require('bcrypt');
const { Pool } = require("pg");

class Admin extends User{
    constructor(data){
        super(data);
    }

   async addLaboratory(id,name,building,floor){
        const validateData=Joi.object(
            {   id:Joi.string().max(10).required(),
                name:Joi.string().max(20).required(),
                building:Joi.string().max(20).required(),
                floor: Joi.number().max(3).required(),
            }).validate({
                id:id,
                name:name,
                building:building,
                floor:floor,
            });

        if (this._database.connectionError){
            return new Promise((resolve)=>resolve({connectionError:true}));
        }

        if(validateData.error){
            return new Promise((resolve)=>resolve({validationError:validateData.error}));
        }

        const result=await this._database.insert("laboratory",[id,name,building,floor,true]);
        console.log(result);
        if(result.error){
            return new Promise((resolve)=>resolve({action:false}));
        }
    
        return new Promise((resolve)=>resolve({action:true}));
    }

    async removeLaboratory(labId){
        if (this._database.connectionError){
            return new Promise((resolve)=>resolve({connectionError:true}));
        }
        console.log(labId);
        const result=await this._database.update("laboratory",["is_active","=",false,"lab_id","=",labId]);
        console.log(result);
        if (!result.error){
            return new Promise((resolve)=>resolve({action:true}));
        }
        return new Promise((resolve)=>resolve({action:false}));
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
         //encrypt the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        password = hashedPassword;

        const values=[userId,firstName,lastName,email,password,contactNo,true];
        // console.log(values);
        //console.log([staffType,[userId,firstName,lastName,email,password,contactNo,true]]);
        const result=await this._database.insert(staffType,null,values);
        console.log(result);

        if (result.error){
            return new Promise((resolve)=>resolve({action:false}))
        }

        return new Promise((resolve)=>resolve({action:true}));

    }

    async removeUser(userType,userId){
        if(this._database.connectionError){
            return new Promise((resolve)=>resolve({connectionError:true}));
        }

        const result=await this._database.update(userType,["is_active","=",false,"user_id","=",userId]);
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

        const result=await this._database.insert("assigned_t_o",null,[T_OId,labId]);

        console.log(result);

        if(result.error){
            if(result.error.code==23505){var message="Already assigned"}
            else{var message="Laboratory or Technical officer doesn't exist"}
            return new Promise((resolve)=>resolve({
                action:false,
                error:message
            }));
        }

        return new Promise((resolve)=>resolve({action:true}));
    }

    async viewLaboratories(){
        if (this._database.connectionError){
            return new Promise((resolve)=>resolve({connectionError:true}));
        }

        const results=await this._database.readTwoTable('laboratory','building',["is_active","=",true]);
        console.log(results);
        if (results.error){
            return new Promise ((resolve)=>resolve({action:false}));
        }

        return new Promise((resolve)=>resolve({action:true,result:results.result.rows}));
    }

    async viewAssignedTechnicalOfficers(){
        if (this._database.connectionError){
            return new Promise((resolve)=>resolve({connectionError:true}));
        }

        const results=await this._database.readThreeTable(['lecturer','assigned_t_o','laboratory']);
        console.log(results);
        if (results.error){
            return new Promise ((resolve)=>resolve({action:false}));
        }

        return new Promise((resolve)=>resolve({action:true,result:results.result.rows}));
    }

    viewReports(){

    }

}

module.exports = Admin;