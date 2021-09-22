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

    async getDashboardData(){
        if (this._database.connectionError){
            return new Promise((resolve)=>{resolve({connectionError:true})});
        }
            const result=await this._database.getCount("request","state",["lecturer_id","=",this._u_id]);

            if (result.error){
                return new Promise((resolve)=>{action:false})
            }
            
            let data=result.result.rows
            console.log(data)
            let state=["Pending","Approved","Rejected"];
            for (let i=0;i<data.length;i++){
                console.log(data[i].state)
                if (data[i].state==0){data[i].state=state[0]}
                
                else if (data[i].state==1){data[i].state=state[1]}
                
                else if (data[i].state==2){data[i].state=state[2]}
                console.log(data)
                
            }
            return new Promise((resolve)=>resolve({action:true,data:data}))
        
    }
}

module.exports = Lecturer;