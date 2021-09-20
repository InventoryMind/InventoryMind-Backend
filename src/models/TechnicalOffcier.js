const Joi = require("joi");
const User = require("./User");

class TechnicalOffcier extends User{
    constructor(data){
        super(data);
    }

    async addEquipment(name,type_id){
        const validateData=Joi.object(
            {   name:Joi.string().max(20).required(),
                type_id:Joi.string().max(20).required(),
            }).validate({
                name:name,
                type_id:type_id,
            });
            console.log(validateData);
        if (this._database.connectionError){
            return new Promise((resolve)=>resolve({connectionError:true}));
        }

        if(validateData.error){
            return new Promise((resolve)=>resolve({validationError:validateData.error}));
        }

        var labId=await this._database.readTwoTable("laboratory","assigned_t_o",["t_o_id","=",this._u_id]);
        // console.log(result);

        if(labId.rowCount!=0){
            var equipId=await this._database.readMax("equipment","eq_id");
            // console.log("New type");
            equipId=equipId.result.rows[0].max;
            equipId=parseInt(equipId)+1;
            labId=labId.result.rows[0].lab_id;
            // console.log(labId);
            var date=new Date();
            var add_date=date.getDate()+'/'+(parseInt(date.getMonth())+1)+'/'+date.getFullYear();
            const result1=await this._database.insert("equipment",null,[equipId,labId,name,type_id,add_date,0,"NEW"]);
            // console.log(result1);
            if (!result1.error){
                return new Promise((resolve)=>resolve({action:true}));
            }
        }       
        return new Promise((resolve)=>resolve({action:false})); 
            
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

    async getEquipTypes(){
        if (this._database.connectionError){
            return new Promise((resolve)=>resolve({connectionError:true}));
        }

        var result=await this._database.readSingleTable("equipment_type",null,["type_id",">",0]);
        var count=result.result.rowCount;
        // console.log(result);
        if (count!=0){
            result=result.result.rows;
            var eqTypes=[];
            for (let i=0;i<count;i++){
                eqTypes[i]={typeId:result[i].type_id,name:result[i].brand + "   " + result[i].type}
            }
            console.log(eqTypes[0]);
            return new Promise((resolve)=>resolve({action:true,data:eqTypes}));    
        }
        return new Promise((resolve)=>{
            resolve({action:false});
        });
    }
}

module.exports = TechnicalOffcier;