const User = require("./User");
const Joi = require("joi").extend(require("@joi/date"));
const bcrypt = require("bcrypt");
const e = require("express");

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

  async viewRequest(reqId) {
    if (this._database.connectionError) {
        return new Promise((resolve) => {
          resolve({ connectionError: true });
        });
      }

      const result=await this._database.viewRequest(reqId);

    if(result.error){
        return new Promise((resolve)=>{
            resolve({action:false})
        })
    }
    // console.log(result)
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
    result.forEach((element) => {
      // console.log(element.date_of_borrowing.getFullYear());
      console.log(element);
      if (element.state == 0) {
        if (element.state == 0) {
          let y = element.date_of_borrowing.getFullYear();
          let m = element.date_of_borrowing.getMonth();
          let d = element.date_of_borrowing.getDate();
          m = parseInt(m) + 1;
          data.push({
            requestId: element.request_id,
            dateOfBorrowing: y + "/" + m + "/" + d,
          });
        }
      }
    });

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
    console.log(result2)

    if (result1.error || result2.error) {
      return new Promise((resolve) => {
        resolve({ action: false });
      });
    }
    let temp_borrow= result1.result.rows;
    let normal_borrow=result2.result.rows;
    console.log(temp_borrow)
    console.log(normal_borrow)
    let data = [];
    temp_borrow.forEach((element) => {
      // console.log(element.date_of_borrowing.getFullYear());
      // console.log(element);
      if (element.state == 0) {
        if (element.state == 0) {
          let y = element.date_of_borrowing.getFullYear();
          let m = element.date_of_borrowing.getMonth();
          let d = element.date_of_borrowing.getDate();
          m = parseInt(m) + 1;
          data.push({
            requestId: element.borrow_id,
            dateOfBorrowing: y + "/" + m + "/" + d,
            type:"Temporary Borrowed"
          });
        }
      }
    });

    normal_borrow.forEach((element) => {
      // console.log(element.date_of_borrowing.getFullYear());
      // console.log(element);
      if (element.state == 0) {
        if (element.state == 0) {
          let y = element.date_of_borrowing.getFullYear();
          let m = element.date_of_borrowing.getMonth();
          let d = element.date_of_borrowing.getDate();
          m = parseInt(m) + 1;
          data.push({
            requestId: borrow.request_id,
            dateOfBorrowing: y + "/" + m + "/" + d,
            type:"Normal Borrowed"
          });
        }
      }
    });

    return new Promise((resolve) => {
      resolve({ action: true, data: data });
    });
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

    if (result.error) {
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

    
    return new Promise((resolve)=>{
        resolve({action:true,data:res})
    })

  }
}

module.exports = Student;
