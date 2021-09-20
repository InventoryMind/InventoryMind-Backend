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
    try {
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
      _pool
        .get(this)
        .connect()
        .then(() => console.log("DB is connected"))
        .catch((e) => console.error(e.stack));
      _connectionError.set(this, false);
    } catch (ex) {
      _connectionError.set(this, true);
    }
  }

  get connectionError() {
    return _connectionError.get(this);
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

      _pool
        .get(this)
        .query(query, (error, results) =>
          resolve({ error: error, result: results })
        );
    });
  }
  //Get max column value
  readMax(tableName,columnName){
    return new Promise((resolve)=>{
      let query=format("SELECT MAX(%I) FROM %I",columnName,tableName);
      _pool.get(this).query(query,(error,result)=>{
        resolve({error:error,result:result});
      });
    }
    );
  }
  //read data from single table
  readSingleTable(tableName, columns, action) {
    return new Promise((resolve) => {
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

      _pool
        .get(this)
        .query(query, (error, results) =>
          resolve({ error: error, result: results })
        );
    });
  }

  //read data from joining two tables using join operators
  readTwoTable(mainTable, joiningTable, action = []) {
    return new Promise((resolve) => {
      const query = format(
        "SELECT * FROM %I NATURAL JOIN %I WHERE %I %s %L",
        mainTable,
        joiningTable,
        action[0],
        action[1],
        action[2]
      );
      _pool.get(this).query(query, (error, results) => {
        resolve({ error: error, result: results });
      });
    });
  }

  //read data from joining three tables
  readThreeTable(tables = [], action = []) {
    return new Promise((resolve) => {
      const query = format(
        "SELECT DISTINCT * FROM (%I NATURAL JOIN %I) NATURAL JOIN %I ",
        tables[0],
        tables[1],
        tables[2]
      );
      _pool.get(this).query(query, (error, results) => {
        resolve({ error: error, result: results });
      });
    });
  }

  // //update a table
  update(tableName, action) {
    return new Promise((resolve) => {
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
      _pool.get(this).query(query, (error, results) => {
        // console.log(results);
        resolve({ error: error, result: results });
      });
    });
  }

  //delete tuples from a table
  delete(tableName, action) {
    return new Promise((resolve) => {
      let query = format(
        "DELETE FROM %I WHERE %I %s %L",
        tableName,
        action[0],
        action[1],
        action[2]
      );
      _pool.get(this).query(query, (error, results) => {
        resolve({ error: error, result: results });
      });
    });
  }

  //for call the stored procedures
  call(name, args = []) {
    return new Promise((resolve) => {
      _pool.get(this).query("CALL %L((%L))", name, args, (error, results) => {
        resolve({ error: error, result: results });
      });
    });
  }

  //Procedure for makeRequest
  async makeRequest(
    studentId,
    lecturerId,
    dateOfBorrowing,
    dateOfReturning,
    reason,
    eqIds
  ) {
    return new Promise(async (resolve) => {
      const client= await _pool.get(this).connect();
      try {
        await client.query("BEGIN");
        // console.log("1")
        var query = format("SELECT MAX(CAST(request_id AS integer)) FROM request");
        var reqId;
        const result = await client
          .query(query, async (err, result) => {
            console.log(err);

            reqId = result.rows[0].max;
            console.log(reqId);
            reqId = parseInt(reqId) + 1;
            // console.log("2")
            console.log(reqId);
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
              await client.query(query);
            });
            // console.log("commit");
            await client
              .query("COMMIT",(err,res)=>console.log(res));
            console.log("COMMITED");
            resolve({ result: true, error: false });
          })
      } catch (e) {
        console.log("Rollbacked");
        client.query("ROLLBACK",(err, res) => console.log(res));
        resolve({ error: true });
      }
    }).catch((e)=>{
      console.log("Rollbacked2");
        client.query("ROLLBACK",(err, res) => console.log(res));
        resolve({ error: true });
    });
  }
}
module.exports = Database;
