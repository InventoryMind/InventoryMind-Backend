const Joi = require("joi");
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

    if (labId.rowCount != 0) {
      var equipId = await this._database.readMax("equipment", "eq_id");
      // console.log("New type");
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
    if (this._database.connectionError) {
      return new Promise((resolve) => resolve({ connectionError: true }));
    }
    // console.log(EqId);
    const result = await this._database.update("equipment", [
      "state",
      "=",
      5,
      "eq_id",
      "=",
      eqId,
    ]);
    // console.log(result);
    if (!result.error && result.result.rowCount != 0) {
      return new Promise((resolve) => resolve({ action: true }));
    }
    return new Promise((resolve) => resolve({ action: false }));
  }

  acceptReturns() {}

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
    if (!result.error && result.result.rowCount != 0) {
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

    if (this._database.connectionError) {
      return new Promise((resolve) => resolve({ connectionError: true }));
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
    if (!result.error && result.result.rowCount != 0) {
      return new Promise((resolve) => resolve({ action: true }));
    }
    return new Promise((resolve) => resolve({ action: false }));
  }

  viewReports() {}

  async viewInventory() {
    if (this._database.connectionError) {
      return new Promise((resolve) => resolve({ connectionError: true }));
    }
    // console.log(EqId);

    const result = await this._database.readThreeTable(['equipment','equipment_type','assigned_t_o'],['t_o_id','=',this._u_id]);
    // console.log(result);
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
    if (!result.error && result.result.rowCount != 0) {
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
    }
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
        action: false;
      });
    }

    let data=result.result.rows
    console.log(data)
    let data1=[];
   
    console.log(data1);
    const insert = function (arr, index, item ) {
        arr.splice( index, 0, item );
    };
    let state=["Available","Requested","Temp Borrowed","Borrowed","Not Usable","Removed"];
    for (let i=0;i<6;i++){
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
    console.log(data)

    return new Promise((resolve)=>resolve({action:true,data:data}));
  }
}

module.exports = TechnicalOffcier;
