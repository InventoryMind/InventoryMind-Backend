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
        // console.log(result);

        if(result.result.rowCount==0){
            var typeId=await this._database.readMax("equipment_type","type_id");
            // console.log("New type");
            typeId=typeId.result.rows[0].max;
            typeId=parseInt(typeId)+1;
            const result1=await this._database.insert("equipment_type",null,[typeId,type,brand]);
            if (result1.error){
                return new Promise((resolve)=>resolve({action:false}));
            }
        }       
        // console.log("Type already exist");
        typeId=result.result.rowCount==0 ? typeId : result.result.rows[0].type_id; 
        var date=new Date();
        var add_date=date.getDay()+'/'+(parseInt(date.getMonth())+1)+'/'+date.getFullYear();
        const result1=await this._database.insert("equipment",null,[EqId,labId,name,typeId,add_date,0,"NEW"]);
        // console.log(result1);
        if (result1.error){
            return new Promise((resolve)=>resolve({action:false}));    
        }
        return new Promise((resolve)=>resolve({action:true}));      
    }

   async removeEquipment(eqId){
    const validateData=Joi.object(
        {   eqId:Joi.string().max(10).required()
        }).validate({
            eqId:eqId
        });
    
    if(validateData.error){
        return new Promise((resolve)=>resolve({validationError:validateData.error}));
    }
        if (this._database.connectionError){
            return new Promise((resolve)=>resolve({connectionError:true}));
        }
        // console.log(EqId);
        const result=await this._database.update("equipment",["state","=",5,"eq_id","=",eqId]);
        // console.log(result);
        if (!result.error && result.result.rowCount!=0){
            return new Promise((resolve)=>resolve({action:true}));
        }
        return new Promise((resolve)=>resolve({action:false}));
    }

    acceptReturns(){

    }

    async reportCondition(eqId,condition){
        const validateData=Joi.object(
            {   eqId:Joi.string().max(10).required(),
                condition:Joi.string().required(),
            }).validate({
                eqId:eqId,
                condition:condition
            });
        console.log(eqId);
        if(validateData.error){
            return new Promise((resolve)=>resolve({validationError:validateData.error}));
        }

        if (this._database.connectionError){
            return new Promise((resolve)=>resolve({connectionError:true}));
        }
        // console.log(EqId);
        const result=await this._database.update("equipment",["condition","=",condition,"eq_id","=",eqId]);
        // console.log(result);
        if (!result.error && result.result.rowCount!=0){
            return new Promise((resolve)=>resolve({action:true}));
        }
        return new Promise((resolve)=>resolve({action:false}));
    }

    async transferEquipment(eqId,labId){
        const validateData=Joi.object(
            {   eqId:Joi.string().max(10).required(),
                labId:Joi.string().max(3).required(),
            }).validate({
                eqId:eqId,
                labId:labId
            });
        
        if(validateData.error){
            return new Promise((resolve)=>resolve({validationError:validateData.error}));
        }

        if (this._database.connectionError){
            return new Promise((resolve)=>resolve({connectionError:true}));
        }
        // console.log(EqId);
        const result=await this._database.update("equipment",["lab_id","=",labId,"eq_id","=",eqId]);
        // console.log(result);
        if (!result.error && result.result.rowCount!=0){
            return new Promise((resolve)=>resolve({action:true}));
        }
        return new Promise((resolve)=>resolve({action:false}));
    }

    viewReports(){

    }

    async viewAvailableLabEquipment(){
        if (this._database.connectionError){
            return new Promise((resolve)=>resolve({connectionError:true}));
        }
        // console.log(EqId);
        const result=await this._database.readTwoTable("equipment","equipment_type",["state","=",0]);
        // console.log(result);
        if (!result.error && result.result.rowCount!=0){
            return new Promise((resolve)=>resolve({action:true,data:result.result.rows}));
        }
        return new Promise((resolve)=>resolve({action:false}));
    }

}

module.exports = TechnicalOffcier;