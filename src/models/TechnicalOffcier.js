const Joi = require("joi");
const format = require("pg-format");
const User = require("./User");

class TechnicalOffcier extends User {
  constructor(data) {
    super(data);
  }

  async addEquipment(name, type_id) {
    const validateData = Joi.object({
      name: Joi.string().max(20).required(),
      type_id: Joi.string().max(20).required(),
    }).validate({
      name: name,
      type_id: type_id,
    });
    console.log(validateData);
    if (this._database.connectionError) {
      return new Promise((resolve) => resolve({ connectionError: true }));
    }

    if (validateData.error) {
      return new Promise((resolve) =>
        resolve({ validationError: validateData.error })
      );
    }

    var labId = await this._database.readTwoTable(
      "laboratory",
      "assigned_t_o",
      ["t_o_id", "=", this._u_id]
    );
    // console.log(result);

    if (labId.result || !labId.error) {
      var equipId = await this._database.readMax("equipment", "eq_id");
      // console.log("New type");
      if(equipId.error)return new Promise((resolve)=>resolve({action:false}))
      equipId = equipId.result.rows[0].max;
      equipId = parseInt(equipId) + 1;
      labId = labId.result.rows[0].lab_id;
      // console.log(labId);
      var date = new Date();
      var add_date =
        date.getDate() +
        "/" +
        (parseInt(date.getMonth()) + 1) +
        "/" +
        date.getFullYear();
      const result1 = await this._database.insert("equipment", null, [
        equipId,
        labId,
        name,
        type_id,
        add_date,
        0,
        "NEW",
      ]);
      console.log(result1);
      if (!result1.error) {
        return new Promise((resolve) => resolve({ action: true,eqId:equipId }));
      }
    }
    return new Promise((resolve) => resolve({ action: false }));
  }

  async getLabs(){
    const result=await this._database.readSingleTable("laboratory",null,["is_active","=",true]);

    if (this._database.connectionError){
      return new Promise((resolve)=>{
        resolve({connectionError:true})
      })
    }

    if(result.error){
      return new Promise((resolve)=>{
        resolve({action:false})
      })
    }
    console.log(result)
    return new Promise((resolve)=>{
      resolve({action: true,data:result.result.rows});
    })
  }

  async removeEquipment(eqId) {
    const validateData = Joi.object({
      eqId: Joi.string().max(10).required(),
    }).validate({
      eqId: eqId,
    });

    if (validateData.error) {
      return new Promise((resolve) =>
        resolve({ validationError: validateData.error })
      );
    }

    // console.log(EqId);
    const result1=await this._database.readSingleTable("equipment",null,["eq_id","=",eqId]);
    
    if (this._database.connectionError) {
      return new Promise((resolve) => resolve({ connectionError: true }));
    }

    if (result1.error || result1.result.rowCount == 0) {
      return new Promise((resolve) => resolve({ action: false,notFound:true }));
    }

    const result = await this._database.update("equipment", [
      "state",
      "=",
      5,
      "eq_id",
      "=",
      eqId,
    ]);
    // console.log(result);
    if (!result.error) {
      return new Promise((resolve) => resolve({ action: true }));
    }
    return new Promise((resolve) => resolve({ action: false }));
  }

  async markAsNotUsable(eqId) {
    const validateData = Joi.object({
      eqId: Joi.string().max(10).required(),
    }).validate({
      eqId: eqId,
    });

    if (validateData.error) {
      return new Promise((resolve) =>
        resolve({ validationError: validateData.error })
      );
    }

    // console.log(EqId);
    const result1=await this._database.readSingleTable("equipment",null,["eq_id","=",eqId]);
    
    if (this._database.connectionError) {
      return new Promise((resolve) => resolve({ connectionError: true }));
    }

    if (result1.error || result1.result.rowCount == 0) {
      return new Promise((resolve) => resolve({ action: false,notFound:true }));
    }

    const result = await this._database.update("equipment", [
      "state",
      "=",
      4,
      "eq_id",
      "=",
      eqId,
    ]);
    // console.log(result);
    if (!result.error) {
      return new Promise((resolve) => resolve({ action: true }));
    }
    return new Promise((resolve) => resolve({ action: false }));
  }

  async markAsAvailable(eqId) {
    const validateData = Joi.object({
      eqId: Joi.string().max(10).required(),
    }).validate({
      eqId: eqId,
    });

    if (validateData.error) {
      return new Promise((resolve) =>
        resolve({ validationError: validateData.error })
      );
    }

    // console.log(EqId);
    const result1=await this._database.readSingleTable("equipment",null,["eq_id","=",eqId]);
    
    if (this._database.connectionError) {
      return new Promise((resolve) => resolve({ connectionError: true }));
    }

    if (result1.error || result1.result.rowCount == 0) {
      return new Promise((resolve) => resolve({ action: false,notFound:true }));
    }

    const result = await this._database.update("equipment", [
      "state",
      "=",
      0,
      "eq_id",
      "=",
      eqId,
    ]);
    // console.log(result);
    if (!result.error) {
      return new Promise((resolve) => resolve({ action: true }));
    }
    return new Promise((resolve) => resolve({ action: false }));
  }

  async getBorrowDetails(borrowId,type){
    if (this._database.connectionError) {
      return new Promise((resolve) => resolve({ connectionError: true }));
    }
    let result;
    if (type=='normal'){
      result=await this._database.readThreeTableUsing(["normal_borrowing","request","request_id","requested_equipments","request_id"],["borrow_id","=",borrowId])
    }
    else{
      result=await this._database.readTwoTable('temporary_borrowing','temporary_borrowed_equipments',['borrow_id','=',borrowId])
    }

    
    if (!result.error) {
      let data=result.result.rows
      let eqIds=[];
      data.forEach(element=>{
        eqIds.push(element.eq_id)
      })
      return new Promise((resolve) => resolve({ action: true,data:eqIds }));
    }
    return new Promise((resolve) => resolve({ action: false }));

  }

  async acceptReturns(borrowId,type) {
    if (this._database.connectionError) {
      return new Promise((resolve) => resolve({ connectionError: true }));
    }

    const result= await this._database.acceptReturns(borrowId,type);

    if (!result.error) {
      return new Promise((resolve) => resolve({ action: true }));
    }
    return new Promise((resolve) => resolve({ action: false }));
  }

  async reportCondition(eqId, condition) {
    const validateData = Joi.object({
      eqId: Joi.string().max(10).required(),
      condition: Joi.string().required(),
    }).validate({
      eqId: eqId,
      condition: condition,
    });
    console.log(eqId);
    if (validateData.error) {
      return new Promise((resolve) =>
        resolve({ validationError: validateData.error })
      );
    }

    if (this._database.connectionError) {
      return new Promise((resolve) => resolve({ connectionError: true }));
    }
    // console.log(EqId);
    const result = await this._database.update("equipment", [
      "condition",
      "=",
      condition,
      "eq_id",
      "=",
      eqId,
    ]);
    // console.log(result);
    if (!result.error) {
      return new Promise((resolve) => resolve({ action: true }));
    }
    return new Promise((resolve) => resolve({ action: false }));
  }

  async transferEquipment(eqId, labId) {
    const validateData = Joi.object({
      eqId: Joi.string().max(10).required(),
      labId: Joi.string().max(3).required(),
    }).validate({
      eqId: eqId,
      labId: labId,
    });

    if (validateData.error) {
      return new Promise((resolve) =>
        resolve({ validationError: validateData.error })
      );
    }

    const result1=await this._database.readSingleTable("equipment",null,["eq_id","=",eqId]);
    
    if (this._database.connectionError) {
      return new Promise((resolve) => resolve({ connectionError: true }));
    }

    if (result1.error || result1.result.rowCount == 0) {
      return new Promise((resolve) => resolve({ action: false,notFound:true }));
    }

    // console.log(EqId);
    const result = await this._database.update("equipment", [
      "lab_id",
      "=",
      labId,
      "eq_id",
      "=",
      eqId,
    ]);
    // console.log(result);
    if (!result.error) {
      return new Promise((resolve) => resolve({ action: true }));
    }
    return new Promise((resolve) => resolve({ action: false }));
  }

  async viewInventory() {
    if (this._database.connectionError) {
      return new Promise((resolve) => resolve({ connectionError: true }));
    }
    // console.log(EqId);

    const result = await this._database.readThreeTable(['equipment','equipment_type','assigned_t_o'],['t_o_id','=',this._u_id]);
    // console.log(result);
    if (result.error) {
      return new Promise((resolve) => resolve({ action: false }));
    }
    var data1=result.result.rows;
    var data=[]
    let state=["Available","Requested","Temporarily Borrowed","Borrowed","Not Usable","Removed"];
    data1.forEach(element => {
      if (element.state!=5){
            element.state=state[element.state]
            data.push(element);
        // console.log(element)
      }
    });
      return new Promise((resolve) =>
        resolve({ action: true, data: data })
      );
 
  }

  async getLabId(){
    const result=await this._database.readSingleTable("assigned_t_o",null,["t_o_id","=",this._u_id]);
    if (result.error){
      return new Promise((resolve)=>{
        resolve(null)
      })
    }

    let labId=result.result.rows[0].lab_id;
    return new Promise((resolve)=>{
      resolve(labId)
    })
  }

  async viewBorrowedEquipments() {
    if (this._database.connectionError) {
      return new Promise((resolve) => resolve({ connectionError: true }));
    }
    const labId=await this.getLabId();
    if (!labId){
      return new Promise((resolve) => resolve({ action: false }));
    }
    console.log(labId);

    const result = await this._database.readSingleTable(
      "borrowed_items",
      null,
      ["lab_id", "=", labId]
    );
    console.log(result);
    if (!result.error) {
      let data=result.result.rows;
      data.forEach((element)=>{
        element.date_of_borrowing=new Date(element.date_of_borrowing).toLocaleString().split(',')[0]
        element.date_of_returning=new Date(element.date_of_returning).toLocaleString().split(',')[0]

      })
      return new Promise((resolve) =>
        resolve({ action: true, data: data })
      );
    }
    return new Promise((resolve) => resolve({ action: false }));
  }

  async viewAvailableLabEquipment() {
    if (this._database.connectionError) {
      return new Promise((resolve) => resolve({ connectionError: true }));
    }
    // console.log(EqId);
    const result = await this._database.readTwoTable(
      "equipment",
      "equipment_type",
      ["state", "=", 0]
    );
    // console.log(result);
    if (!result.error && result.result.rowCount != 0) {
      return new Promise((resolve) =>
        resolve({ action: true, data: result.result.rows })
      );
    }
    return new Promise((resolve) => resolve({ action: false }));
  }

  async getEquipTypes() {
    if (this._database.connectionError) {
      return new Promise((resolve) => resolve({ connectionError: true }));
    }

    var result = await this._database.readSingleTable("equipment_type", null, [
      "type_id",
      ">",
      0,
    ]);
    if (!result.error){
      var count = result.result.rowCount;
    // console.log(result);
    if (count != 0) {
      result = result.result.rows;
      var eqTypes = [];
      for (let i = 0; i < count; i++) {
        eqTypes[i] = {
          typeId: result[i].type_id,
          name: result[i].brand + "   " + result[i].type,
        };
      }
      console.log(eqTypes[0]);
      return new Promise((resolve) => resolve({ action: true, data: eqTypes }));
    }}
    return new Promise((resolve) => {
      resolve({ action: false });
    });
  }

  async getDashboardDataMob() {
    if (this._database.connectionError) {
      return new Promise((resolve) => {
        resolve({ connectionError: true });
      });
    }

    const res=await this._database.readSingleTable('assigned_t_o',null,["t_o_id","=",this._u_id]);

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
        resolve({action: false})
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

  async getRequestStats() {
    if (this._database.connectionError) {
      return new Promise((resolve) => {
        resolve({ connectionError: true });
      });
    }

    const res=await this._database.readSingleTable('assigned_t_o',null,["t_o_id","=",this._u_id]);

    if (res.error || res.result.rowCount==0){
        return new Promise((resolve) => resolve({
            action: false
          }));
    }
    let labId=res.result.rows[0].lab_id;
    let query=format("select DISTINCT(request_id),lab_id,request.state as state from request join requested_equipments using (request_id) join equipment using (eq_id) where lab_id=%L",labId);
    let result = await this._database.query(query);
    if (result.error) {
      return new Promise((resolve) => {
        resolve({action: false})
      });
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

}

module.exports = TechnicalOffcier;
