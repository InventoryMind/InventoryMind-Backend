const User = require("./User");
const Joi=require('joi');
const { viewAllRequest } = require("../controllers/student");

class Lecturer extends User{
    constructor(data){
        super(data);
    }

    async approve(reqId){
        const validateData=Joi.object({
            reqId:Joi.string().pattern(/^[0-9]+$/).required()
        }).validate({
            reqId:reqId
        });

        console.log(validateData);
        console.log("approve")
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
            reqId:Joi.string().pattern(/^[0-9]+$/).required()
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

    async viewAllRequests(){
            if (this._database.connectionError) {
              return new Promise((resolve) => {
                resolve({ connectionError: true });
              });
            }
        
            var result = await this._database.readSingleTable("request", null, [
              "lecturer_id",
              "=",
              this._u_id,
            ]);
            console.log(result)
        
            if (result.error) {
              return new Promise((resolve) => {
                resolve({ action: false });
              });
            }
            result = result.result.rows;
            // console.log(result)
            let data = [];
            let state=["","Accepted","Rejected"]
            result.forEach((element) => {
              // console.log(element.date_of_borrowing.getFullYear());
              if (element.state!=0){console.log(element);
              
               
                  let y = element.date_of_borrowing.getFullYear();
                  let m = element.date_of_borrowing.getMonth();
                  let d = element.date_of_borrowing.getDate();
                  m = parseInt(m) + 1;
                  data.push({
                    requestId: element.request_id,
                    student:element.student_id,
                    dateOfBorrowing: y + "/" + m + "/" + d,
                    state:state[element.state]
                  });}
                
              
            });
        
            return new Promise((resolve) => {
              resolve({ action: true, data: data });
            });  
    }

    async viewAcceptedRequest(){
        let all=await this.viewAllRequests();

        if (all.connectionError){
            return new Promise((resolve)=>{
                resolve({connectionError:true});
            })
        }

        if (!all.action){
            return new Promise((resolve)=>{
                resolve({action:false});
            });
        }
        all=all.data;
        let accepted=all.filter(element=>element.state=="Accepted");

        return new Promise((resolve)=>{
            resolve({
                action:true,
                data:accepted
            })
        })
    }

    async viewRejectedRequest(){
        let all=await this.viewAllRequests();

        if (all.connectionError){
            return new Promise((resolve)=>{
                resolve({connectionError:true});
            })
        }

        if (!all.action){
            return new Promise((resolve)=>{
                resolve({action:false});
            });
        }
        all=all.data;
        let rejected=all.filter(element=>element.state=="Rejected");

        return new Promise((resolve)=>{
            resolve({
                action:true,
                data:rejected
            })
        })
    }

    async viewPendingRequests(){
        if (this._database.connectionError) {
            return new Promise((resolve) => {
              resolve({ connectionError: true });
            });
          }
      
          var result = await this._database.readSingleTable("request", null, [
            "lecturer_id",
            "=",
            this._u_id,
          ]);
          console.log(result)
      
          if (result.error) {
            return new Promise((resolve) => {
              resolve({ action: false });
            });
          }
          result = result.result.rows;
          // console.log(result)
          let data = [];
          result.forEach((element) => {
            // console.log(element.date_of_borrowing.getFullYear());
            if (element.state==0){
                // console.log(element);
            
             
                let y = element.date_of_borrowing.getFullYear();
                let m = element.date_of_borrowing.getMonth();
                let d = element.date_of_borrowing.getDate();
                m = parseInt(m) + 1;
                data.push({
                  requestId: element.request_id,
                  student:element.student_id,
                  dateOfBorrowing: y + "/" + m + "/" + d,
                  state:"Pending"
                });}
              
            
          });
          console.log(result)
          return new Promise((resolve) => {
            resolve({ action: true, data: data });
          });  
    }

    async viewRequest(reqId) {
        if (this._database.connectionError) {
            return new Promise((resolve) => {
              resolve({ connectionError: true });
            });
          }
    
          const result=await this._database.viewRequest(reqId);
    
        if(result.error || result.result.rowCount==0){
            return new Promise((resolve)=>{
                resolve({action:false})
            })
        }
        // console.log(result)
        let data=result.result.rows;
        let types={};
        console.log(data)
        data.forEach(element=>{
            if ((Object.keys(types)).includes(element.type_id)){
                types[element.type_id].count+=1
            }
            else{
                types[element.type_id]={type:element.type,brand:element.brand,count:1}
            }
        });
        console.log(types)
        console.log(data[0])
        let res=data[0]
      
        let lec=await this._database.readSingleTable("lecturer",null,["user_id","=",this._u_id]);
        if(lec.error){
            return new Promise((resolve)=>{
                resolve({action:false})
            })
        }
        lec=lec.result.rows[0];
        console.log(res)

        res.lecturer=lec.first_name+" "+lec.last_name;

        let stud=await this._database.readSingleTable("student",null,["user_id","=",res.student_id]);
        if(stud.error){
            return new Promise((resolve)=>{
                resolve({action:false})
            })
        }
        stud=stud.result.rows[0];
        
        res.student=stud.first_name+" "+stud.last_name;

        res.eq_id=undefined;
        res.type_id=undefined;
        res.type=undefined;
        res.brand=undefined;
        res.types=types;
        
        let date=res.date_of_borrowing;
    let y = date.getFullYear();
    let m = date.getMonth();
    let d = date.getDate();
    m = parseInt(m) + 1;
    res.date_of_borrowing=y + "/" + m + "/" + d;
    date=res.date_of_returning
    y =date.getFullYear();
    m = date.getMonth();
    d = date.getDate();
    m = parseInt(m) + 1;
    res.date_of_returning=y + "/" + m + "/" + d;
        
        return new Promise((resolve)=>{
            resolve({action:true,data:res})
        })
    
    }


    async getDashboardDataMob(){
        if (this._database.connectionError){
            return new Promise((resolve)=>{resolve({connectionError:true})});
        }
            const result=await this._database.getCount("request","state",["lecturer_id","=",this._u_id]);

            if (result.error){
                return new Promise((resolve)=>resolve({action:false}))
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