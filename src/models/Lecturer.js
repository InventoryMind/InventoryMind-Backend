const User = require("./User");
const Joi=require('joi');

class Lecturer extends User{
    constructor(data){
        super(data);
    }

    async approve(reqId){
        const validateData=Joi.object({
            reqId:Joi.string().required()
        }).validate({
            reqId:reqId
        });

        console.log(validateData);

        if (validateData.error){
            return new Promise((resolve)=>{resolve({validationError:validateData.error})});
        }

        if (this._database.connectionError){
            return new Promise((resolve)=>{resolve({connectionError:true})});
        }

        const result= await this._database.update("request",["state","=",1,"request_id","=",reqId]);
        console.log(result);

        if (!result.error && result.result.rowCount!=0){
            return new Promise((resolve)=>{
                resolve({
                    action: true
                });
            });
        }

        return new Promise((resolve)=>{
            resolve({action:false});
        });
    }

    async reject(reqId){
        const validateData=Joi.object({
            reqId:Joi.string().required()
        }).validate({
            reqId:reqId
        });

        console.log(validateData);

        if (validateData.error){
            return new Promise((resolve)=>{resolve({validationError:validateData.error})});
        }

        if (this._database.connectionError){
            return new Promise((resolve)=>{resolve({connectionError:true})});
        }

        const result= await this._database.update("request",["state","=",2,"request_id","=",reqId]);
        console.log(result);

        if (!result.error && result.result.rowCount!=0){
            return new Promise((resolve)=>{
                resolve({
                    action: true
                });
            });
        }

        return new Promise((resolve)=>{
            resolve({action:false});
        });
    }

    async viewPendingRequests(){
        const result=this ;
    }

    viewRequestHistory(){

    }

}

module.exports = Lecturer;