const User = require("./User");
const Joi = require("joi").extend(require("@joi/date"));
const bcrypt = require("bcrypt");
const e = require("express");
const Email=require('../utils/Email');

class Student extends User {
  constructor(data) {
    super(data);
  }

  async register(userId, firstName, lastName, email, contactNo) {
    const validateData = Joi.object({
      userId: Joi.string().max(10).required(),
      firstName: Joi.string().max(20).required(),
      lastName: Joi.string().max(20).required(),
      email: Joi.string().max(30).email().required(),
      contactNo: Joi.string().min(10).max(10).required(),
    }).validate({
      userId: userId,
      firstName: firstName,
      lastName: lastName,
      email: email,
      contactNo: contactNo,
    });
    console.log(validateData);
    if (validateData.error) {
      return new Promise((resolve) =>
        resolve({ validationError: validateData.error })
      );
    }
    // console.log(validateData);
    if (this._database.connectionError) {
      return new Promise((resolve) => resolve({ connectionError: true }));
    }
    let password = firstName + "@" + userId;
    //encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    password = hashedPassword;

    const values = [
      userId,
      firstName,
      lastName,
      email,
      password,
      contactNo,
      true,
    ];
    // console.log(values);
    //console.log([staffType,[userId,firstName,lastName,email,password,contactNo,true]]);
    const result = await this._database.insert("student", null, values);
    console.log(result);

    if (result.error) {
      return new Promise((resolve) => resolve({ action: false }));
    }
    let emailSender=new Email();
    emailSender.send(email,"Registration Successfull","You are successfully registered as a student to InventoryMind.");

    return new Promise((resolve) => resolve({ action: true }));
  }

  async makeBorrowRequest(
    lecturerId,
    dateOfBorrowing,
    dateOfReturning,
    reason,
    eqIds
  ) {
    const validateData = Joi.object({
      lecturerId: Joi.string().max(10).required(),
      dateOfBorrowing: Joi.date().format("DD/MM/YYYY").required(),
      dateOfReturning: Joi.date().format("DD/MM/YYYY").required(),
      reason: Joi.string().max(30).required(),
      eqIds: Joi.array().items(Joi.string().max(20)).required(),
    }).validate({
      lecturerId: lecturerId,
      dateOfBorrowing: dateOfBorrowing,
      dateOfReturning: dateOfReturning,
      reason: reason,
      eqIds: eqIds,
    });

    if (validateData.error) {
      return new Promise((resolve) =>
        resolve({ validationError: validateData.error })
      );
    }
    // console.log(validateData);
    if (this._database.connectionError) {
      return new Promise((resolve) => resolve({ connectionError: true }));
    }
    // const values=[req_id,userId,firstName,lastName,email,password,contactNo,true];
    // console.log(values);
    //console.log([staffType,[userId,firstName,lastName,email,password,contactNo,true]]);
    const result = await this._database.makeRequest(
      this._u_id,
      lecturerId,
      dateOfBorrowing,
      dateOfReturning,
      reason,
      eqIds
    );
    console.log(result);

    if (result.error) {
      return new Promise((resolve) => resolve({ action: false }));
    }

    return new Promise((resolve) => resolve({ action: true }));
  }

  async borrowTemporarily(reason, eqIds) {
    const validateData = Joi.object({
      reason: Joi.string().max(30).required(),
      eqIds: Joi.array().items(Joi.string().max(20)).required(),
    }).validate({
      reason: reason,
      eqIds: eqIds,
    });
    // console.log(validateData);
    if (validateData.error) {
      return new Promise((resolve) =>
        resolve({ validationError: validateData.error })
      );
    }
    if (this._database.connectionError) {
      return new Promise((resolve) => resolve({ connectionError: true }));
    }
    let availability = await this.checkItemAvailability(eqIds);
    // console.log(availability);
    if (!availability.available) {
      return new Promise((resolve) => {
        resolve({
          action: false,
          msg: "Item not available",
          data: availability.data,
        });
      });
    }
    let date = new Date();
    var dateOfBorrowing =
      date.getDate() +
      "/" +
      (parseInt(date.getMonth()) + 1) +
      "/" +
      date.getFullYear();
    const result = await this._database.borrowTemporarily(
      this._u_id,
      dateOfBorrowing,
      reason,
      eqIds
    );
    console.log(result);

    if (result.error) {
      return new Promise((resolve) => resolve({ action: false }));
    }

    return new Promise((resolve) => resolve({ action: true }));
  }

  async viewAllRequest() {
    if (this._database.connectionError) {
      return new Promise((resolve) => {
        resolve({ connectionError: true });
      });
    }

    var result = await this._database.readSingleTable("request", null, [
      "student_id",
      "=",
      this._u_id,
    ]);
    // console.log(result.result)

    if (result.error) {
      return new Promise((resolve) => {
        resolve({ action: false });
      });
    }
    result = result.result.rows;
    // console.log(result)
    let data = [];
    let state=["Pending","Accepted","Rejected"];
    result.forEach((element) => {
      // console.log(element.date_of_borrowing.getFullYear());
      console.log(element);
          let y = element.date_of_borrowing.getFullYear();
          let m = element.date_of_borrowing.getMonth();
          let d = element.date_of_borrowing.getDate();
          m = parseInt(m) + 1;
          data.push({
            requestId: element.request_id,
            dateOfBorrowing: y + "/" + m + "/" + d,
            state:state[element.state]
          });
    });

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
      console.log(reqId)
      const result=await this._database.viewRequest(reqId);
      console.log(result)

    if(result.error || result.result.rowCount==0){
        return new Promise((resolve)=>{
            resolve({action:false})
        })
    }
    console.log(result)
    let data=result.result.rows;
    let types={};
    // console.log(types.keys())
    data.forEach(element=>{
        if (element.type_id in Object.keys(types)){
            types[element.type_id][count]+=1
        }
        else{
            types[element.type_id]={type:element.type,brand:element.brand,count:1}
        }
    });
    console.log(types)
    console.log(data[0])
    let res=data[0]
  
    let lec=await this._database.readSingleTable("lecturer",null,["user_id","=",res.lecturer_id]);
    console.log(lec)
    if(lec.error){
        return new Promise((resolve)=>{
            resolve({action:false})
        })
    }
    lec=lec.result.rows[0];
    res.lecturer=lec.first_name+" "+lec.last_name;
  
    res.eq_id=undefined;
    res.type_id=undefined;
    res.type=undefined;
    res.brand=undefined;
    res.types=types;
    console.log(res.date_of_borrowing.getFullYear())
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

  async checkItemAvailability(eqIds) {
    // console.log("check called")
    let isItemAvailable = async (eqId) => {
      const result = await this._database.readSingleTable("equipment", null, [
        "eq_id",
        "=",
        eqId,
      ]);
      // console.log(result);
      if (result.error || result.result.rowCount == 0) {
        return new Promise((resolve) => {
          resolve({
            error: true,
          });
        });
      }
      return new Promise((resolve) => {
        let state = [
          "available",
          "requested",
          "temporarily borrowed",
          "borrowed",
          "not usable",
          "removed",
        ];
        resolve({
          eqId: result.result.rows[0].eq_id,
          state: state[parseInt(result.result.rows[0].state)],
        });
      });
    };

    // console.log(result);
    let availability = [];
    let available = true;
    for (let i = 0; i < eqIds.length; i++) {
      availability[i] = await isItemAvailable(eqIds[i]);
      available = available && availability[i].state === "available";
      // console.log(available);
    }
    // console.log(availability);
    return new Promise((resolve) => {
      resolve({
        data: availability,
        available: available,
      });
    });
  }

  async getDashboardDataM() {
    if (this._database.connectionError) {
      return new Promise((resolve) => {
        resolve({ connectionError: true });
      });
    }

    var result1 = await this._database.readSingleTable("temporary_borrowing", null, [
      "student_id",
      "=",
      this._u_id,
    ]);

    var result2 = await this._database.readTwoTable("normal_borrowing","request",[
      "student_id",
      "=",
      this._u_id,
    ],"request_id");
    console.log(result2)

    if (result1.error || result2.error) {
      return new Promise((resolve) => {
        resolve({ action: false });
      });
    }
    let temp_borrow= result1.result.rows;
    let normal_borrow=result2.result.rows;
    // console.log(temp_borrow)
    // console.log(normal_borrow)
    let temp_borrow1=[];
    let normal_borrow1=[];
    temp_borrow.forEach(element=>{
      if (element.state==0){
        temp_borrow1.push(element);
      }
    });
    normal_borrow.forEach(element=>{
      if (element.state==0){
        normal_borrow1.push(element);
      }
    });

    let data1 =this.formatTempBorrows(temp_borrow1);
    let data2=this.formatNormalBorrows(normal_borrow1);
    let data=[...data1,...data2];

    return new Promise((resolve) => {
      resolve({ action: true, data: data });
    });
  }

  async viewBorrowedHistory() {
    if (this._database.connectionError) {
      return new Promise((resolve) => {
        resolve({ connectionError: true });
      });
    }

    var result1 = await this._database.readSingleTable("temporary_borrowing", null, [
      "student_id",
      "=",
      this._u_id,
    ]);

    var result2 = await this._database.readTwoTable("normal_borrowing","request",[
      "student_id",
      "=",
      this._u_id,
    ],"request_id");
    // console.log(result2)

    if (result1.error || result2.error) {
      return new Promise((resolve) => {
        resolve({ action: false });
      });
    }
    let temp_borrow= result1.result.rows;
    let normal_borrow=result2.result.rows;
    // console.log(temp_borrow)
    // console.log(normal_borrow)
    

    let data1 =this.formatTempBorrows(temp_borrow);
    let data2=this.formatNormalBorrows(normal_borrow);
    let data=[...data1,...data2];

    return new Promise((resolve) => {
      resolve({ action: true, data: data });
    });
  }

  formatTempBorrows(temp_borrow){
  let state=["Borrowed","Delayed","Returned","Cancelled"]
  let data=[]
    temp_borrow.forEach((element) => {
      // console.log(element.date_of_borrowing.getFullYear());
      // console.log(element);
          let by = element.date_of_borrowing.getFullYear();
          let bm = element.date_of_borrowing.getMonth();
          let bd = element.date_of_borrowing.getDate();
          let retDate=new Date(element.date_of_borrowing);
          retDate.setDate(retDate.getDate()+1);
          let ry = retDate.getFullYear();
          let rm=retDate.getMonth();
          let rd=retDate.getDate();
          bm=parseInt(bm)+1;
          rm = parseInt(rm) + 1;
          data.push({
            borrowId: element.borrow_id,
            dateOfBorrowing: by + "/" + bm + "/" + bd,
            dateOfReturning: ry+"/"+rm+"/"+rd,
            type:"Temporary Borrowed",
            state:state[element.state]
          });
    });
    return data;
  }

 formatNormalBorrows(normal_borrow){
  let state=["Borrowed","Delayed","Returned","Cancelled"]
  let data=[]
  normal_borrow.forEach((element) => {
    // console.log(element.date_of_borrowing.getFullYear());
    // console.log(element);
        let by = element.date_of_borrowing.getFullYear();
        let bm = element.date_of_borrowing.getMonth();
        let bd = element.date_of_borrowing.getDate();
        bm = parseInt(bm) + 1;
        let ry = element.date_of_returning.getFullYear();
        let rm = element.date_of_returning.getMonth();
        let rd = element.date_of_returning.getDate();
        rm = parseInt(rm) + 1;
        data.push({
          borrowId:element.borrow_id,
          requestId: element.request_id,
          dateOfBorrowing: by + "/" + bm + "/" + bd,
          dateOfReturning: ry+"/"+rm+"/"+rd,
          type:"Normal Borrowed",
          state:state[element.state]
        });
      
  });
  return data;
}
  async viewBorrowDetails(borrow_id,type){
    if (this._database.connectionError) {
      return new Promise((resolve) => {
        resolve({ connectionError: true });
      });
    }
    let result;
    let lec;
    if(type=="normal"){
      result=await this._database.viewNormalBorrowed(borrow_id);
      lec=await this._database.readSingleTable("lecturer",null,["user_id","=",res.lecturer_id]);
      if(lec.error){
          return new Promise((resolve)=>{
              resolve({action:false})
          })
      }
      lec=lec.result.rows[0];
    }
    else{
      result=await this._database.viewTempBorrowed(borrow_id);
    }

    if (result.error || result.result.rowCount==0) {
      return new Promise((resolve) => {
        resolve({ action: false });
      });
    }

    let data=result.result.rows;
    let types={};
    // console.log(types.keys())
    data.forEach(element=>{
        if (element.type_id in Object.keys(types)){
            types[element.type_id][count]+=1
        }
        else{
            types[element.type_id]={type:element.type,brand:element.brand,count:1}
        }
    });
    console.log(types)
    console.log(data[0])
    let res=data[0]


    if(type=="normal")res.lecturer=lec.first_name+" "+lec.last_name;
    res.eq_id=undefined;
    res.type_id=undefined;
    res.type=undefined;
    res.brand=undefined;
    res.state=undefined;
    res.lab_id=undefined;
    res.name=undefined;
    res.added_date=undefined;
    res.condition=undefined;
    res.types=types;

    let y = res.date_of_borrowing.getFullYear();
    let m = res.date_of_borrowing.getMonth();
    let d = res.date_of_borrowing.getDate();
    m = parseInt(m) + 1;
    res.date_of_borrowing=y+"/"+m+"/"+d
    if(type!="normal"){
      d=parseInt(d)+1
      res.date_of_returning=y+"/"+m+"/"+d
    }
    else{
      y = res.date_of_returning.getFullYear();
      m = res.date_of_returning.getMonth();
      d = res.date_of_returning.getDate();
      m = parseInt(m) + 1;
      res.date_of_returning=y+"/"+m+"/"+d
    }

    
    return new Promise((resolve)=>{
        resolve({action:true,data:res})
    })

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
    data.forEach(element=>{
      element.is_active=undefined;
      element.b_id=undefined;
      
    })
    return new Promise((resolve)=>resolve({action:true,result:data}));
}

async getLecturers(){
  if (this._database.connectionError){
      return new Promise((resolve)=>resolve({connectionError:true}));
  }

  const results=await this._database.readSingleTable('lecturer',null,["is_active","=",true]);
  console.log(results);
  if (results.error){
      return new Promise ((resolve)=>resolve({action:false}));
  }
  let data=results.result.rows;
  data.forEach(element=>{
    element.password=undefined;
    element.email=undefined;
    element.is_active=undefined;
    element.contact_no=undefined
  })
  return new Promise((resolve)=>resolve({action:true,result:data}));
}

}

module.exports = Student;
