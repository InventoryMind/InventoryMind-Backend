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

    async getDashboardDataMob(){
        if (this._database.connectionError){
            return new Promise((resolve)=>{resolve({connectionError:true})});
        }
            const result=await this._database.getCount("request","state",["lecturer_id","=",this._u_id]);

            if (result.error){
                return new Promise((resolve)=>{action:false})
            }
            
            const insert = function (arr, index, item ) {
                arr.splice( index, 0, item );
            };

            let data=result.result.rows
            console.log(data)
            let data1=[];
            let state=["Pending","Approved","Rejected"];
        for (let i=0;i<3;i++){
        if (data[i]==null){
            insert(data,i,{
                state:state[i],
                count:0
            });
        }
        else if (data[i].state!=i){
            insert(data,i,{
                state:state[i],
                count:0
            });
        }
        else{
            data[i].state=state[data[i].state]
        }
    }
            return new Promise((resolve)=>resolve({action:true,data:data}))
        
    }
}

module.exports = Lecturer;