const {Pool} = require("pg");
const format =require('pg-format');
const config = require("config");
const dotenv=require('dotenv');
const _pool = new WeakMap();
const _connectionError = new WeakMap();
const _getResults = new WeakMap();
// const client = new Client(config.get("database_credentials"));
dotenv.config();

class Database {
  constructor() {
    try {
      _pool.set(this, new Pool(process.env.DATABASE_URL));
      _pool.get(this).connect().then(()=>console.log("DB is connected")).catch(e=>console.error(e.stack));
      _connectionError.set(this, false);
    } catch (ex) {
      _connectionError.set(this, true);
    }

    _getResults.set(this, (error, results) => {
      if (error) {
        return { error: true };
      }
      return { error: false, result: results };
    });
  }

  get connectionError() {
    return _connectionError.get(this);
  }

  //Insert new tuples into database
  insert(tableName, values) {
    //console.log([tableName,values]);
    return new Promise((resolve) => {
       //console.log(values);
      const query=format("INSERT INTO %I VALUES (%L)",tableName,values)
      _pool.get(this).query(query,(error,results)=> resolve({error:error, result:results}));
    });
  }

  //read data from single table
  readSingleTable(tableName, columns, action = [], sort = [], limit = []) {
    return new Promise((resolve) => {
       const query=format('SELECT * FROM %I WHERE %I %s %L',tableName,action[0],action[1],action[2]);
      _pool.get(this).query(query,(error,results)=>resolve({error:error,result:results}));
    });
  }

  //read data from multiple tables using join operators
  readMultipleTable(mainTable,joiningTable,columns,action = [],sort = [],limit = []) {
    return new Promise((resolve) => {
      const query= format('SELECT * FROM %I NATURAL JOIN %I WHERE %I %s %L',mainTable,joiningTable,action[0],action[1],action[2]);
      _pool.get(this).query(query,(error, results) => {
            resolve({error:error,result:results});
          }
        );
    });
  }

  // //update a table


  //delete tuples from a table
  delete(tableName, action) {
    return new Promise((resolve) => {
      let query=format("DELETE FROM %I WHERE %I %s %L",tableName,action[0],action[1],action[2])
      _pool.get(this).query(query,(error, results) => {
            resolve(_getResults.get(this)(error, results));
          });
    });
  }

  //for call the stored procedures
  call(name, args = []) {
    return new Promise((resolve) => {
      _pool
        .get(this)
        .query(`CALL ??(?)`, [name, args], (error, results, fields) => {
          resolve(_getResults.get(this)(error, results));
        });
    });
  }
}

module.exports = Database;
