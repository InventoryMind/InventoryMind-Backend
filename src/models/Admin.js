const e = require("express");
const Joi = require("joi");
const User = require("./User");
const bcrypt=require('bcrypt');
const { Pool } = require("pg");
const Email= require('../utils/Email');
const generator = require('generate-password');
const format = require("pg-format");


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

        const result=await this._database.insert("laboratory",null,[id,name,building,floor,true]);
        console.log(validateData);
        if(result.error){
            return new Promise((resolve)=>resolve({action:false}));
        }
    
        return new Promise((resolve)=>resolve({action:true}));
    }

    async removeLaboratory(labId){
        const validateData=Joi.object(
            {   id:Joi.string().max(10).pattern(new RegExp(/^\d+$/)).required(),
             }).validate({
                id:labId
            });
        if (this._database.connectionError){
            return new Promise((resolve)=>resolve({connectionError:true}));
        }
        if(validateData.error){
            return new Promise((resolve)=>resolve({validationError:validateData.error}));
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
        // let password=firstName+'@'+userId;
        var password = generator.generate({
            length: 15,
            numbers: true
        });
         //encrypt the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // password = hashedPassword;

        const values=[userId,firstName,lastName,email,hashedPassword,contactNo,true];
        // console.log(values);
        //console.log([staffType,[userId,firstName,lastName,email,password,contactNo,true]]);
        const result=await this._database.insert(staffType,null,values);
        console.log(result);

        if (result.error){
            return new Promise((resolve)=>resolve({action:false}))
        }
        // console.log(password)
        let emailSender=await new Email();
        await emailSender.send(email,"Registration Successfull","You are successfully registered as a "+staffType+" to InventoryMind.\nUsername: "+email+" \nPassword: "+password+"\nPlease login to the system using this credintials and change your password.");

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

    async viewUsers(user_type){
        if (this._database.connectionError){
            return new Promise((resolve)=>resolve({connectionError:true}));
        }

        const results=await this._database.readSingleTable(user_type,null,["is_active","=",true]);
        console.log(results);
        if (results.error){
            return new Promise ((resolve)=>resolve({action:false}));
        }
        let data=results.result.rows;
        data.forEach(element => {
            element.password=undefined;
        });
        return new Promise((resolve)=>resolve({action:true,result:data}));
    }

    async getBuildings(){
        if (this._database.connectionError){
            return new Promise((resolve)=>resolve({connectionError:true}));
        }

        const results=await this._database.readSingleTable('building',null,["b_id",">",0]);
        console.log(results);
        if (results.error){
            return new Promise ((resolve)=>resolve({action:false}));
        }
        let data=results.result.rows;
        return new Promise((resolve)=>resolve({action:true,result:data}));
    }

    async getLabs(){
        if (this._database.connectionError){
            return new Promise((resolve)=>resolve({connectionError:true}));
        }

        const results=await this._database.readSingleTable('laboratory',null,["is_active","=",true]);
        console.log(results);
        if (results.error){
            return new Promise ((resolve)=>resolve({action:false}));
        }
        let data=results.result.rows;
        return new Promise((resolve)=>resolve({action:true,result:data}));
    }

    async getTOs(){
        if (this._database.connectionError){
            return new Promise((resolve)=>resolve({connectionError:true}));
        }

        const results=await this._database.readSingleTable('technical_officer',null,["is_active","=",true]);
        console.log(results);
        if (results.error){
            return new Promise ((resolve)=>resolve({action:false}));
        }
        let data=results.result.rows;
        return new Promise((resolve)=>resolve({action:true,result:data}));
    }


    async viewAssignedTechnicalOfficers(){
        if (this._database.connectionError){
            return new Promise((resolve)=>resolve({connectionError:true}));
        }
        const query="select distinct user_id,first_name,last_name,email,contact_no,lab_id,name as lab_name,b_name,floor from (technical_officer left outer join assigned_t_o on technical_officer.user_id=assigned_t_o.t_o_id) natural left outer join laboratory natural left outer join building"
        const results=await this._database.query(query);
        // console.log(results);
        if (results.error){
            return new Promise ((resolve)=>resolve({action:false}));
        }
        let data=results.result.rows;
        data.forEach(element => {
            element.password=undefined;
        });
        console.log(data)
        return new Promise((resolve)=>resolve({action:true,result:data}));
    }


    async addEquipType(type,brand){
        if(this._database.connectionError){
            return new Promise((resolve)=>resolve({connectionError:true}));
        }
        const res1=await this._database.readMax('equipment_type','type_id');
        if (res1.error){
            return new Promise((resolve)=>resolve({action:false}));
        }
        var typeId=res1.result.rows[0].max;
        typeId=parseInt(typeId)+1;
        const result=await this._database.insert('equipment_type',null,[typeId,type,brand]);
        console.log(result);

        if (result.error){
            return new Promise((resolve)=>resolve({action:false}));
        }

        return new Promise ((resolve)=>resolve({action:true}));
    }

    async getDashboardData(){
        if (this._database.connectionError){
            return new Promise((resolve)=>{resolve({connectionError:true})});
        }
            const result1=await this._database.getCount("laboratory",null,["is_active","=",true]);
            const result2=await this._database.getCount("lecturer",null,["is_active","=",true]);
            const result3=await this._database.getCount("student",null,["is_active","=",true]);
            const result4=await this._database.getCount("technical_officer",null,["is_active","=",true]);
            console.log(result1);
            if (result1.error || result2.error || result3.error || result4.error){
                return new Promise((resolve)=>{action:false})
            }
            
            const insert = function (arr, index, item ) {
                arr.splice( index, 0, item );
            };

           const data={
                laboratory:result1.result.rows[0],
                lecturer:result2.result.rows[0],
                student:result3.result.rows[0],
                technicalOfficer:result4.result.rows[0],

           }
    
            return new Promise((resolve)=>resolve({action:true,data:data}))
        
    }

    async getRequestStats() {
        if (this._database.connectionError) {
          return new Promise((resolve) => {
            resolve({ connectionError: true });
          });
        }
    
        let query=format("select DISTINCT(request_id),lab_id,request.state as state from request join requested_equipments using (request_id) join equipment using (eq_id)");
        let result = await this._database.query(query);
        if (result.error || result.result.rowCount==0) {
          return new Promise((resolve) =>resolve({
            action: false
          }));
        }
    
        console.log(result);
    
        let data=result.result.rows
    
        let count={pending:0,accepted:0,rejected:0}
    
        data.forEach(element=>{
          if (element.state==0){
            count.pending+=1;
          }
          else if(element.state==1){
            count.accepted+=1;
          }
          else{
            count.rejected+=1;
          }
        })
    
        return new Promise((resolve)=>resolve({action:true,data:count}));
      }

      async getUserStats() {
        if (this._database.connectionError) {
          return new Promise((resolve) => {
            resolve({ connectionError: true });
          });
        }
    
        let result = await this._database.getCount("student", null, [
          "user_id",
          "!=",
          "",
        ]);
    
        if (result.error || result.result.rowCount==0) {
          return new Promise((resolve) => resolve({
            action: false
          }));
        }
    
        let student=result.result.rows[0].count
        
        result = await this._database.getCount("lecturer", null, [
          "user_id",
          "!=",
          "",
        ]);
    
        if (result.error || result.result.rowCount==0) {
          return new Promise((resolve) => resolve({
            action: false
          }));
        }
    
        let lecturer=result.result.rows[0].count
    
        result = await this._database.getCount("technical_officer", null, [
          "user_id",
          "!=",
          "",
        ]);
    
        if (result.error || result.result.rowCount==0) {
          return new Promise((resolve) =>resolve({
            action: false
          }));
        }
    
        let techOff=result.result.rows[0].count
    
        let data={lecturer:lecturer,student:student,technicalOfficer:techOff}
    
        return new Promise((resolve)=>resolve({action:true,data:data}));
      }

      async getEquipStats() {
        if (this._database.connectionError) {
          return new Promise((resolve) => {
            resolve({ connectionError: true });
          });
        }
    
        const res=await this._database.readSingleTable('assigned_t_o',null,["t_o_id","!=",""]);
    
        if (res.error || res.result.rowCount==0){
            return new Promise((resolve) => resolve({
                action: false
              }));
        }
        let labId=res.result.rows[0].lab_id;
        const result = await this._database.getCount("equipment", "state", [
          "lab_id",
          "=",
          labId,
        ]);
    
        if (result.error) {
          return new Promise((resolve) => {
            action: false;
          });
        }
    
        let data=result.result.rows
        console.log(data)
       let data1=[{state:"Available",count:0},{state:"Requested",count:0},{state:"Temporary Borrowed",count:0},{state:"Normal Borrowed",count:0},{state:"Not Usable",count:0},{state:"Removed",count:0}]
        data.forEach(element=>{
          data1[element.state].count=element.count;
        })
      
        console.log(data1)
    
        return new Promise((resolve)=>resolve({action:true,data:data1}));
      }

    //   async getUserStats() {
    //     if (this._database.connectionError) {
    //       return new Promise((resolve) => {
    //         resolve({ connectionError: true });
    //       });
    //     }
    
    //     let result = await this._database.getCount("student", null, [
    //       "user_id",
    //       "!=",
    //       "",
    //     ]);
    
    //     if (result.error || result.result.rowCount==0) {
    //       return new Promise((resolve) => resolve({
    //         action: false
    //       }));
    //     }
    
    //     let student=result.result.rows[0].count
        
    //     result = await this._database.getCount("lecturer", null, [
    //       "user_id",
    //       "!=",
    //       "",
    //     ]);
    
    //     if (result.error || result.result.rowCount==0) {
    //       return new Promise((resolve) => resolve({
    //         action: false
    //       }));
    //     }
    
    //     let lecturer=result.result.rows[0].count
    
    //     result = await this._database.getCount("technical_officer", null, [
    //       "user_id",
    //       "!=",
    //       "",
    //     ]);
    
    //     if (result.error || result.result.rowCount==0) {
    //       return new Promise((resolve) =>resolve({
    //         action: false
    //       }));
    //     }
    
    //     let techOff=result.result.rows[0].count
    
    //     let data={lecturer:lecturer,student:student,technicalOfficer:techOff}
    
    //     return new Promise((resolve)=>resolve({action:true,data:data}));
    //   }

    //   async getRequestStats(labId) {
    //     if (this._database.connectionError) {
    //       return new Promise((resolve) => {
    //         resolve({ connectionError: true });
    //       });
    //     }
    
    //     let query=format("select DISTINCT(request_id),lab_id,request.state as state from request join requested_equipments using (request_id) join equipment using (eq_id) where lab_id=%L",labId);
    //     let result = await this._database.query(query);
    //     if (result.error) {
    //       return new Promise((resolve) => {
    //         action: false;
    //       });
    //     }
    
    //     console.log(result);
    
    //     let data=result.result.rows
    
    //     let count={pending:0,accepted:0,rejected:0}
    
    //     data.forEach(element=>{
    //       if (element.state==0){
    //         count.pending+=1;
    //       }
    //       else if(element.state==1){
    //         count.accepted+=1;
    //       }
    //       else{
    //         count.rejected+=1;
    //       }
    //     })
    
    //     return new Promise((resolve)=>resolve({action:true,data:count}));
    //   }

    //   async getEquipStats(labId) {
    //     if (this._database.connectionError) {
    //       return new Promise((resolve) => {
    //         resolve({ connectionError: true });
    //       });
    //     }
    
    //     const result = await this._database.getCount("equipment", "state", [
    //       "lab_id",
    //       "=",
    //       labId,
    //     ]);
    
    //     if (result.error) {
    //       return new Promise((resolve) => {
    //         action: false;
    //       });
    //     }
    
    //     let data=result.result.rows
    //     console.log(data)
    //    let data1=[{state:"Available",count:0},{state:"Requested",count:0},{state:"Temporary Borrowed",count:0},{state:"Normal Borrowed",count:0},{state:"Not Usable",count:0},{state:"Removed",count:0}]
    //     data.forEach(element=>{
    //       data1[element.state].count=element.count;
    //     })
      
    //     console.log(data1)
    
    //     return new Promise((resolve)=>resolve({action:true,data:data1}));
    //   }

}

module.exports = Admin;
