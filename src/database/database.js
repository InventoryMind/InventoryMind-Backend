const { Pool,Client } = require("pg");
const format = require("pg-format");

const dotenv = require("dotenv");
const e = require("express");
const _pool = new WeakMap();
const _connectionError = new WeakMap();
const _getResults = new WeakMap();
// const client = new Client(config.get("database_credentials"));
dotenv.config();

class Database {
  constructor() {
    // try {
      var dbconfig = {
        user: process.env.user,
        database: process.env.db,
        password: process.env.password,
        host: process.env.host,
        port: 5432,
        //        ssl:{
        // rejectUnauthorized: false
        // }
      };
      _pool.set(this, new Pool(dbconfig));
    //   _pool
    //     .get(this)
    //     .connect()
    //     .then(() => console.log("DB is connected"))
    //     .catch((e) => console.error(e.stack));
    //   _connectionError.set(this, false);
    // } catch (ex) {
    //   _connectionError.set(this, true);
    // }
  }

  get connectionError() {
    return _connectionError.get(this);
  }

  connect(){
    return new Promise((resolve)=>{
      try{
        _pool.get(this).connect().then((client)=>{console.log("DB isconnected")
        resolve(client)
      }).catch((e)=>console.error(e.stack));
        _connectionError.set(this,false);
      }
      catch{
        _connectionError.set(this,true)
      }
    });
    
  }

  //Insert new tuples into database
  insert(tableName, columns, values) {
    //console.log([tableName,values]);
    return new Promise(async(resolve) => {
      var query;
      await _pool.get(this).query("SET datestyle = dmy");
      if (columns == null) {
        query = format("INSERT INTO %I VALUES (%L)", tableName, values);
      } else {
        query = format(
          "INSERT INTO %I((%I)) VALUES (%L)",
          tableName,
          columns,
          values
        );
      }
      // console.log(query)
      const client=await this.connect();

      client
        .query(query, (error, results) =>{
          client.release();
          console.log("Connection released"+",TotalCount:"+_pool.get(this).totalCount+",IdleCount:"+_pool.get(this).idleCount)      
          resolve({ error: error, result: results })
    }
        );
    });
  }
  //Get max column value
  readMax(tableName,columnName){
    return new Promise(async(resolve)=>{
      let query=format("SELECT MAX(CAST(%I AS INTEGER)) FROM %I",columnName,tableName);
      const client=await this.connect();

      client.query(query,(error,result)=>{
        client.release();
        console.log("Connection released"+",TotalCount:"+_pool.get(this).totalCount+",IdleCount:"+_pool.get(this).idleCount)    
        resolve({error:error,result:result});
      });
    }
    );
  }
  //read data from single table
  readSingleTable(tableName, columns, action) {

    return new Promise(async(resolve) => {
      var query;
      if (columns == null) {
        query = format(
          "SELECT * FROM %I WHERE %I %s %L",
          tableName,
          action[0],
          action[1],
          action[2]
        );
      } else {
        query = format(
          "SELECT (%I) FROM %I WHERE %I %s %L",
          columns,
          tableName,
          action[0],
          action[1],
          action[2]
        );
      }
      const client=await this.connect();
      client
        .query(query, (error, results) =>{      
          console.log("Before" +_pool.get(this).idleCount)    
          client.release();
          console.log("Connection released"+",TotalCount:"+_pool.get(this).totalCount+",IdleCount:"+_pool.get(this).idleCount)    
          resolve({ error: error, result: results })
      }
        );
    
    });
  }

  //read data from joining two tables using join operators
  readTwoTable(mainTable, joiningTable, action = [],using) {
    return new Promise(async (resolve) => {
      let query;
      if(!using){
      query = format(
        "SELECT * FROM %I NATURAL JOIN %I WHERE %I %s %L",
        mainTable,
        joiningTable,
        action[0],
        action[1],
        action[2]
      );
      }else{
        query = format(
          "SELECT * FROM %I JOIN %I USING (%I) WHERE %I %s %L",
          mainTable,
          joiningTable,
          using,
          action[0],
          action[1],
          action[2]
        );
      }
      console.log(query)
      const client=await this.connect();

     client.query(query, (error, results) => {
      client.release();
      console.log("Connection released"+",TotalCount:"+_pool.get(this).totalCount+",IdleCount:"+_pool.get(this).idleCount)    
        resolve({ error: error, result: results });
      });
    });
  }

  // readTwoTableN(mainTable, joiningTable, column,action = []) {
  //   return new Promise((resolve) => {
  //     const query = format(
  //       "SELECT * FROM %I JOIN %I USING(%I) WHERE %I %s %L",
  //       mainTable,
  //       joiningTable,
  //       column,
  //       action[0],
  //       action[1],
  //       action[2]
  //     );
  //     _pool.get(this).query(query, (error, results) => {
  //       resolve({ error: error, result: results });
  //     });
  //   });
  // }

  //read data from joining three tables
  readThreeTable(tables = [], action = []) {
    return new Promise(async(resolve) => {
      const query = format(
        "SELECT DISTINCT * FROM (%I NATURAL JOIN %I) NATURAL JOIN %I WHERE %I %s %L",
        tables[0],
        tables[1],
        tables[2],
        action[0],
        action[1],
        action[2]
      );
      const client=await this.connect();
      client.query(query, (error, results) => {
        client.release();
        console.log("Connection released"+",TotalCount:"+_pool.get(this).totalCount+",IdleCount:"+_pool.get(this).idleCount)    
        resolve({ error: error, result: results });
      });
    });
  }

  readThreeTableUsing(tables = [], action = []) {
    return new Promise(async(resolve) => {
      const query = format(
        "SELECT DISTINCT * FROM %I JOIN %I USING (%I) JOIN %I USING (%I) WHERE %I %s %L",
        tables[0],
        tables[1],
        tables[2],
        tables[3],
        tables[4],
        action[0],
        action[1],
        action[2]
      );
      console.log(query)
      const client=await this.connect();
      client.query(query, (error, results) => {
        client.release();
        console.log("Connection released"+",TotalCount:"+_pool.get(this).totalCount+",IdleCount:"+_pool.get(this).idleCount)    
        resolve({ error: error, result: results });
      });
    });
  }
  //three table left inner join
  readThreeTableL(query) {
    return new Promise(async(resolve) => {
      // const query = format(
      //   "SELECT DISTINCT * FROM (%I LEFT OUTER JOIN %I ON %I = %I) NATURAL LEFT OUTER JOIN %I NATURAL LEFT OUTER JOIN %I",
      //   tables[0],
      //   tables[1],
      //   tables[2],
      //   action[0],
      //   action[1],
      //   action[2]
      // );
      console.log(query);
      const client=await this.connect();
      client.query(query, (error, results) => {
        client.release();
        console.log("Connection released"+",TotalCount:"+_pool.get(this).totalCount+",IdleCount:"+_pool.get(this).idleCount)    
        resolve({ error: error, result: results });
      });
    });
  }
  // //update a table
  update(tableName, action) {
    return new Promise(async (resolve) => {
      let query = format(
        "UPDATE %I SET %I %s %L WHERE %I %s %L",
        tableName,
        action[0],
        action[1],
        action[2],
        action[3],
        action[4],
        action[5]
      );
      const client=await this.connect();
      client.query(query, (error, results) => {
        client.release();
        console.log("Connection released"+",TotalCount:"+_pool.get(this).totalCount+",IdleCount:"+_pool.get(this).idleCount)    
        resolve({ error: error, result: results });
      });
    });
  }

  //delete tuples from a table
  delete(tableName, action) {
    return new Promise(async(resolve) => {
      let query = format(
        "DELETE FROM %I WHERE %I %s %L",
        tableName,
        action[0],
        action[1],
        action[2]
      );
      const client=await this.connect();

      client.query(query, (error, results) => {
        client.release();
        console.log("Connection released"+",TotalCount:"+_pool.get(this).totalCount+",IdleCount:"+_pool.get(this).idleCount)    

        resolve({ error: error, result: results });
      });
    });
  }

  //for call the stored procedures
  // call(name, args = []) {
  //   return new Promise((resolve) => {
  //     _pool.get(this).query("CALL %L((%L))", name, args, (error, results) => {
  //       resolve({ error: error, result: results });
  //     });
  //   });
  // }


  getCount(tableName,column,condition){
    return new Promise(async(resolve)=>{
      let query;
      if (column!=null){
          query=format("SELECT %I,COUNT(%I) FROM %I WHERE %I %s %L GROUP BY %I",column,column,tableName,condition[0],condition[1],condition[2],column);
      }
      else{
        query=format("SELECT COUNT(*) FROM %I WHERE %I %s %L",tableName,condition[0],condition[1],condition[2]);

      }
      console.log(query);
      const client=await this.connect();

      client.query(query,(error,results)=>{
        client.release();
        console.log("Connection released"+",TotalCount:"+_pool.get(this).totalCount+",IdleCount:"+_pool.get(this).idleCount)    
        resolve({error:error,result:results});
      });
    });
  }
  //Procedure for makeRequest
  viewRequest(reqId){
    return new Promise(async (resolve)=>{
      const query=format("select distinct request_id,student_id,lecturer_id,date_of_borrowing,date_of_returning,reason,eq_id,type_id,type,brand from request join requested_equipments using (request_id) left outer join equipment using (eq_id) left outer join equipment_type using (type_id) where request_id=%L",reqId)
      const client=await this.connect();
      client.query(query,(error,results)=>{
        client.release();
        console.log("Connection released"+",TotalCount:"+_pool.get(this).totalCount+",IdleCount:"+_pool.get(this).idleCount)    
        resolve({error:error,result:results});
      });
    })
  }

  viewTempBorrowed(borrowId){
    return new Promise(async (resolve)=>{
      const query=format("select * from temporary_borrowing natural join temporary_borrowed_equipments join equipment using (eq_id) join equipment_type using (type_id) where borrow_id = %L",borrowId)
      const client=await this.connect();
      client.query(query,(error,results)=>{
        client.release();
        console.log("Connection released"+",TotalCount:"+_pool.get(this).totalCount+",IdleCount:"+_pool.get(this).idleCount)    
        resolve({error:error,result:results});
      });
    })
  }

  viewNormalBorrowed(borrowId){
    return new Promise(async (resolve)=>{
      const query=format("select distinct * from normal_borrowing join request using (request_id) join requested_equipments using (request_id) join equipment using (eq_id) join equipment_type using (type_id) where borrow_id =%L",borrowId)
      const client=await this.connect();
      client.query(query,(error,results)=>{
        client.release();
        console.log("Connection released"+",TotalCount:"+_pool.get(this).totalCount+",IdleCount:"+_pool.get(this).idleCount)    
        resolve({error:error,result:results});
      });
    })
  }

  async makeRequest(
    studentId,
    lecturerId,
    dateOfBorrowing,
    dateOfReturning,
    reason,
    eqIds
  ) {
    return new Promise(async (resolve) => {
      let rollback=()=>{
        console.log("Rollbacked2");
          client.query("ROLLBACK");
          resolve({ error: true });
      }
      const client= await this.connect();
      try {
        await client.query("BEGIN");
        // console.log("1")
        var query = format("SELECT MAX(CAST(request_id AS integer)) FROM request");
        var reqId;
        const result = await client
          .query(query, async (err, result) => {
            // console.log(err);

            reqId = result.rows[0].max;
            // console.log(reqId);
            reqId = parseInt(reqId) + 1;
            // console.log("2")
            // console.log(reqId);
            await client.query("SET datestyle = dmy");
            query = format(
              "INSERT INTO request VALUES (%L,%L,%L,%L,%L,%L,0)",
              reqId,
              studentId,
              lecturerId,
              dateOfBorrowing,
              dateOfReturning,
              reason
            );
            // console.log(query);
            await client.query(query);
            // console.log("inserted to request");

            eqIds.forEach(async (eqId) => {
              query = format(
                "INSERT INTO requested_equipments VALUES (%L,%L)",
                reqId,
                eqId
              );
              // console.log(query);
              await client.query(query,(err,result)=>{if(err){rollback()}});
            });
            // console.log("commit");
            await client
              .query("COMMIT");
            // console.log("COMMITED");
            resolve({ result: true, error: false });
          })
      } catch (e) {rollback()}
    }).catch((e)=>{rollback()});
  }
//Procedure for borrow temporarily
  async borrowTemporarily(
    studentId,
    dateOfBorrowing,
    reason,
    eqIds
  ) {
    return new Promise(async (resolve) => {
      let rollback=()=>{
          console.log("Rollbacked2");
            client.query("ROLLBACK");
            resolve({ error: true });
        }
      
      const client= await this.connect();
      try {
        await client.query("BEGIN");
        // console.log("1")
        var query = format("SELECT MAX(CAST(borrow_id AS integer)) FROM temporary_borrowing");
        var borrowId;
        const result = await client
          .query(query, async (err, result) => {
            // console.log(result);

            borrowId = result.rows[0].max==null ? 0 : result.rows[0].max;
            // console.log(borrowId);
            borrowId = parseInt(borrowId) + 1;
            // console.log("2")
            // console.log(borrowId);
            await client.query("SET datestyle = dmy");
            query = format(
              "INSERT INTO temporary_borrowing VALUES (%L,%L,%L,%L,0)",
              borrowId,
              studentId,
              dateOfBorrowing,
              reason
            );
            // console.log(query);
            await client.query(query);
            // console.log("inserted to request");

            eqIds.forEach(async (eqId) => {
              query = format(
                "INSERT INTO temporary_borrowed_equipments VALUES (%L,%L)",
                borrowId,
                eqId
              );
              // console.log(query);
              await client.query(query,(err,res)=>{if(err){rollback()}});
            });
            // console.log("commit");
            await client
              .query("COMMIT");
            // console.log("COMMITED");
            resolve({ result: true, error: false });
          })
      } catch (e) {rollback()}
    }).catch((e)=>{rollback()});
  }

  async acceptReturns(borrowId,type){
    return new Promise(async (resolve) => {
      let rollback=()=>{
          console.log("Rollbacked2");
            client.query("ROLLBACK");
            resolve({ error: true });
        }
      
      const client= await this.connect();
      try {
        await client.query("BEGIN");
        // console.log("1")

        var query;
        var query1;
        if (type=="normal"){
          query1=format("UPDATE normal_borrowing SET state=2 WHERE borrow_id = %L",borrowId)
          query = format("SELECT * FROM normal_borrowing JOIN request USING (request_id) JOIN requested_equipments USING (request_id) WHERE borrow_id = %L",borrowId);
        }
        else{ 
          query1=format("UPDATE temporary_borrowing SET state=2 WHERE borrow_id = %L",borrowId)
          query = format("SELECT * FROM temporary_borrowing JOIN temporary_borrowed_equipments USING (borrow_id) WHERE borrow_id = %L",borrowId);
        }
        console.log(query);
        await client.query(query1,(err,result)=>{
          if (err)rollback();
          console.log("updated borrowing table ");
        });

        const result = await client
          .query(query, async (err, result) => {
            console.log(result);
            let data = result.rows;
            let eqIds=[];
            data.forEach(element=>{
              eqIds.push(element.eq_id)
            });

            eqIds.forEach(async (eqId) => {
              query = format(
                "UPDATE equipment SET state=0 WHERE eq_id=%L",
                eqId
              );
              console.log(query);
              await client.query(query,(err,res)=>{if(err){
                console.log(err);
                rollback()}});
            });
            await client
              .query("COMMIT");
            // console.log("COMMITED");
            resolve({ result: true, error: false });
          })
      } catch (e) {rollback()}
    }).catch((e)=>{rollback()});
  }
}
module.exports = Database;
