const Joi = require("joi");
const User = require("./User");

class TechnicalOffcier extends User{
    constructor(data){
        super(data);
    }

    async addEquipment(EqId,name,labId,type,brand){
        const validateData=Joi.object(
            {   EqId:Joi.string().max(10).required(),
                name:Joi.string().max(20).required(),
                labId:Joi.string().max(3).required(),
                type:Joi.string().max(20).required(),
                brand:Joi.string().max(20).required(),
            }).validate({
                EqId:EqId,
                name:name,
                labId:labId,
                type:type,
                brand:brand
            });

        if (this._database.connectionError){
            return new Promise((resolve)=>resolve({connectionError:true}));
        }

        if(validateData.error){
            return new Promise((resolve)=>resolve({validationError:validateData.error}));
        }

        const result=await this._database.readSingleTable("equipment_type",null,["type","=",type]);
        console.log(result);

        if(result.result){
                console.log("Type already exist");
                var date=new Date();
                var add_date=date.getDay()+'/'+(parseInt(date.getMonth())+1)+'/'+date.getFullYear();
                const result1=await this._database.insert("equipment",null,[EqId,labId,name,result.result.rows.type_id,add_date,0,"NEW"]);
                console.log(result1);
                if (result1.error){
                return new Promise((resolve)=>resolve({action:false}));    
            }
            return new Promise((resolve)=>resolve({action:true}));            
        }

        const result1=await this._database.insert("equipment_type",null,[type,brand])
        return new Promise((resolve)=>resolve({action:true}));
    }

   async removeEquipment(EqId){
        if (this._database.connectionError){
            return new Promise((resolve)=>resolve({connectionError:true}));
        }
        console.log(labId);
        const result=await this._database.update("equipment",["is_active","=",false,"eq_id","=",EqId]);
        console.log(result);
        if (!result.error){
            return new Promise((resolve)=>resolve({action:true}));
        }
        return new Promise((resolve)=>resolve({action:false}));
    }

    acceptReturns(){

    }

    reportCondition(){

    }

    transferEquipment(){

    }

    viewReports(){

    }

    viewAvailableLabEquipment(){

    }

}

module.exports = TechnicalOffcier;