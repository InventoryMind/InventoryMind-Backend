const request = require("supertest");
let server;
const dotenv=require('dotenv');
dotenv.config();
const Database=require("../../database/database");

process.env.db="InventoryMindTest"
process.env.host="localhost"
process.env.user="postgres"
process.env.password="123"

let token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMDAwMCIsImVtYWlsIjoiaW52ZW50b3J5bWluZEBnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJJbnZlbnRvcnkiLCJsYXN0TmFtZSI6IlRlc3QiLCJ1c2VyVHlwZSI6InRlY2huaWNhbF9vZmZpY2VyIiwiaWF0IjoxNjM2NjM1MzUwLCJleHAiOjE2MzY3MjE3NTB9.2fYHsgP49AqPtzCTogl9RH8h57c1EJTeNyYBHxS2m-s";

describe("/addEquipment",()=>{
    let database=new Database();
    beforeEach(async()=>{
        server=require("../../app");
        await database.insert("equipment_type",null,["1","a","a"]);
        await database.insert('laboratory',null,['1','Lab1','1',3,true]);
        await database.insert('assigned_t_o',null,['10000','1']);
    })
    afterEach(async()=>{
        server.close();
        await database.clear("equipment");
        await database.clear("equipment_type");
        await database.clear("assigned_t_o");
        await database.clear("laboratory");
    });

    it("Should add equipment",async ()=>{
        await request(server).post("/techOff/addEquipment").set('Accept','application/json').set("Cookie",`auth-token=${token}`).send({name:"a",typeId:"1"}).then((res)=>{
            expect(res.status).toBe(200)
        });
    })
},500000);