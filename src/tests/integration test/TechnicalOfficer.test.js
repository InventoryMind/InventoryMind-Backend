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

describe("/getLabs",()=>{
    beforeEach(async()=>{
        server=require("../../app");
        let database=new Database();
        await database.insert('laboratory',null,['1','Lab1','1',3,true]);
        await database.insert('laboratory',null,['2','Lab1','1',3,true]);
        await database.insert('laboratory',null,['3','Lab1','1',3,true]);
    })
    afterEach(async()=>{
        server.close();
        let database=new Database();
        await database.clear('laboratory');
    });

    it("Should show lab list",async ()=>{
        await request(server).get("/techOff/getLabs").set('Accept','application/json').set("Cookie",`auth-token=${token}`).then((res)=>{
            expect(res.status).toBe(200);
            expect(res.body.msg.some(i=>i.lab_id=="1")).toBeTruthy();
            expect(res.body.msg.some(i=>i.lab_id=="2")).toBeTruthy();
            expect(res.body.msg.some(i=>i.lab_id=="3")).toBeTruthy();
        });
    });
});

describe("/getUserStats",()=>{
    beforeEach(async()=>{
        server=require("../../app");
    })

    afterEach(async()=>{
        server.close();
    });

    it("Should show stats",async ()=>{
        await request(server).get("/techOff/getUserStats").set('Accept','application/json').set("Cookie",`auth-token=${token}`).then((res)=>{
            expect(res.status).toBe(200);
            expect(res.body.msg.lecturer).toBe("1");
            expect(res.body.msg.student).toBe("1");
            expect(res.body.msg.technicalOfficer).toBe("1");
        });
    });
});

describe("/getRequestStats",()=>{
    beforeEach(async()=>{
        server=require("../../app");
        let database=new Database();
        await database.insert("lecturer",null,["100001","f","f","a@xy.com","sffsf","0777123456",true]);
        await database.insert("student",null,["100001","f","f","a@xy.com","sffsf","0777123456",true]);
        await database.insert('laboratory',null,['1','Lab1','1',3,true]);
        await database.insert("assigned_t_o",null,["10000","1"]);
        await database.insert("equipment_type",null,["1","a","a"]);
        await database.insert("equipment",null,["1","1","a","1","10/11/2021",0,"a"]);
        await database.insert("equipment",null,["2","1","a","1","10/11/2021",0,"a"]);
        await database.insert("equipment",null,["3","1","a","1","10/11/2021",0,"a"]);
        await database.insert("request",null,["1","100001","100001","11/10/2021","13/10/2021","a",0]);
        await database.insert("request",null,["2","100001","100001","11/10/2021","13/10/2021","a",1]);
        await database.insert("request",null,["3","100001","100001","11/10/2021","13/10/2021","a",2]);
        await database.insert("requested_equipments",null,["1","1"]);
        await database.insert("requested_equipments",null,["2","2"]);
        await database.insert("requested_equipments",null,["3","3"]);

    })
    afterEach(async()=>{
        server.close();
        let database=new Database();
        await database.clear("assigned_t_o");
        await database.delete("laboratory",["lab_id","=","1"]);
        await database.clear("requested_equipments");
        await database.clear("equipment");
        await database.clear("request");
        await database.clear("equipment_type");
        await database.delete("lecturer",["user_id","=","100001"]);
        await database.delete("student",["user_id","=","100001"]);

    });

    it("Should show stats",async ()=>{
        await request(server).get("/techOff/getRequestStats").set('Accept','application/json').set("Cookie",`auth-token=${token}`).then((res)=>{
            expect(res.status).toBe(200);
            expect(res.body.msg.pending).toBe(1);
            expect(res.body.msg.accepted).toBe(1);
            expect(res.body.msg.rejected).toBe(1);
        });
    });
},500000);

describe("/removeEquipment/:eqId",()=>{
    let database=new Database();
    beforeEach(async()=>{
        server=require("../../app");
        await database.insert('laboratory',null,['1','Lab1','1',3,true]);
        await database.insert("equipment_type",null,["1","a","a"]);
        await database.insert("equipment",null,["1","1","a","1","10/11/2021",0,"a"]);
        await database.insert("assigned_t_o",null,["10000","1"]);

    })
    afterEach(async()=>{
        server.close();
        await database.clear('laboratory');
        await database.clear("assigned_t_o");
        await database.clear("equipment");
        await database.clear("equipment_type");

    });

    it("Should not remove equipment",async ()=>{
        await request(server).post("/techOff/removeEquipment/3").set('Accept','application/json').set("Cookie",`auth-token=${token}`).send({labId:'1'}).then(async(res)=>{
            expect(res.status).toBe(404);
        });
    });

    it("Should remove equipment",async ()=>{
        await request(server).post("/techOff/removeEquipment/1").set('Accept','application/json').set("Cookie",`auth-token=${token}`).send({labId:'1'}).then(async(res)=>{
            expect(res.status).toBe(200);
            await database.readSingleTable("equipment",null,["eq_id","=","1"]).then((r)=>{
                expect(r.result.rows[0].state).toBe(5);
            })
        });
    });
});

describe("/markAsNotUsable/:eqId",()=>{
    let database=new Database();
    beforeEach(async()=>{
        server=require("../../app");
        await database.insert('laboratory',null,['1','Lab1','1',3,true]);
        await database.insert("equipment_type",null,["1","a","a"]);
        await database.insert("equipment",null,["1","1","a","1","10/11/2021",0,"a"]);
        await database.insert("assigned_t_o",null,["10000","1"]);

    })
    afterEach(async()=>{
        server.close();
        await database.clear('laboratory');
        await database.clear("assigned_t_o");
        await database.clear("equipment");
        await database.clear("equipment_type");

    });

    it("Should not mark as not usable",async ()=>{
        await request(server).post("/techOff/markAsNotUsable/3").set('Accept','application/json').set("Cookie",`auth-token=${token}`).send({labId:'1'}).then(async(res)=>{
            expect(res.status).toBe(404);
        });
    });

    it("Should mark as notUsable",async ()=>{
        await request(server).post("/techOff/markAsNotUsable/1").set('Accept','application/json').set("Cookie",`auth-token=${token}`).send({labId:'1'}).then(async(res)=>{
            expect(res.status).toBe(200);
            await database.readSingleTable("equipment",null,["eq_id","=","1"]).then((r)=>{
                expect(r.result.rows[0].state).toBe(4);
            })
        });
    });
});

describe("/markAsAvailable/:eqId",()=>{
    let database=new Database();
    beforeEach(async()=>{
        server=require("../../app");
        await database.insert('laboratory',null,['1','Lab1','1',3,true]);
        await database.insert("equipment_type",null,["1","a","a"]);
        await database.insert("equipment",null,["1","1","a","1","10/11/2021",4,"a"]);
        await database.insert("assigned_t_o",null,["10000","1"]);

    })
    afterEach(async()=>{
        server.close();
        await database.clear('laboratory');
        await database.clear("assigned_t_o");
        await database.clear("equipment");
        await database.clear("equipment_type");

    });

    it("Should not mark as not available",async ()=>{
        await request(server).post("/techOff/markAsAvailable/3").set('Accept','application/json').set("Cookie",`auth-token=${token}`).send({labId:'1'}).then(async(res)=>{
            expect(res.status).toBe(404);
        });
    });

    it("Should mark as available",async ()=>{
        await request(server).post("/techOff/markAsAvailable/1").set('Accept','application/json').set("Cookie",`auth-token=${token}`).send({labId:'1'}).then(async(res)=>{
            expect(res.status).toBe(200);
            await database.readSingleTable("equipment",null,["eq_id","=","1"]).then((r)=>{
                expect(r.result.rows[0].state).toBe(0);
            })
        });
    });
});

describe("/transferEquipment",()=>{
    let database=new Database();
    beforeEach(async()=>{
        server=require("../../app");
        await database.insert('laboratory',null,['1','Lab1','1',3,true]);
        await database.insert('laboratory',null,['2','Lab2','1',3,true]);
        await database.insert("equipment_type",null,["1","a","a"]);
        await database.insert("equipment",null,["1","1","a","1","10/11/2021",0,"a"]);
        await database.insert("assigned_t_o",null,["10000","1"]);

    })
    afterEach(async()=>{
        server.close();
        await database.clear('laboratory');
        await database.clear("assigned_t_o");
        await database.clear("equipment");
        await database.clear("equipment_type");

    });

    it("Should not transfer equipment",async ()=>{
        await request(server).post("/techOff/transferEquipment").set('Accept','application/json').set("Cookie",`auth-token=${token}`).send({eqId:'2',labId:'2'}).then(async(res)=>{
            expect(res.status).toBe(404);
        });
    });

    it("Should transfer equipment",async ()=>{
        await request(server).post("/techOff/transferEquipment").set('Accept','application/json').set("Cookie",`auth-token=${token}`).send({eqId:'1',labId:'2'}).then(async(res)=>{
            expect(res.status).toBe(200);
            await database.readSingleTable("equipment",null,["eq_id","=","1"]).then((r)=>{
                expect(r.result.rows[0].lab_id).toBe('2');
            })
        });
    });
});

describe("/reportCondition",()=>{
    let database=new Database();
    beforeEach(async()=>{
        server=require("../../app");
        await database.insert('laboratory',null,['1','Lab1','1',3,true]);
        await database.insert("equipment_type",null,["1","a","a"]);
        await database.insert("equipment",null,["1","1","a","1","10/11/2021",0,"some a"]);
        await database.insert("assigned_t_o",null,["10000","1"]);

    })
    afterEach(async()=>{
        server.close();
        await database.clear('laboratory');
        await database.clear("assigned_t_o");
        await database.clear("equipment");
        await database.clear("equipment_type");

    });

    it("Should report equipment condition",async ()=>{
        await request(server).post("/techOff/reportCondition").set('Accept','application/json').set("Cookie",`auth-token=${token}`).send({eqId:'1',condition:'some b'}).then(async(res)=>{
            expect(res.status).toBe(200);
            await database.readSingleTable("equipment",null,["eq_id","=","1"]).then((r)=>{
                expect(r.result.rows[0].condition).toBe('some b');
            })
        });
    });
});

describe("/viewInventory",()=>{
    let database=new Database();
    beforeEach(async()=>{
        server=require("../../app");
        await database.insert('laboratory',null,['1','Lab1','1',3,true]);
        await database.insert("equipment_type",null,["1","a","a"]);
        await database.insert("equipment",null,["1","1","a","1","10/11/2021",0,"some a"]);
        await database.insert("equipment",null,["2","1","a","1","10/11/2021",0,"some a"]);
        await database.insert("assigned_t_o",null,["10000","1"]);

    })
    afterEach(async()=>{
        server.close();
        await database.clear('laboratory');
        await database.clear("assigned_t_o");
        await database.clear("equipment");
        await database.clear("equipment_type");

    });

    it("Should show equipment details",async ()=>{
        await request(server).get("/techOff/viewInventory").set('Accept','application/json').set("Cookie",`auth-token=${token}`).then(async(res)=>{
            expect(res.status).toBe(200);
            // console.log(res.body)
            expect(res.body.data.some(i=>i.eq_id=='1')).toBeTruthy();
            expect(res.body.data.some(i=>i.eq_id=='2')).toBeTruthy();
            expect(res.body.data.length).toBe(2);

        });
    });
});

describe("/viewAvailableEquips",()=>{
    let database=new Database();
    beforeEach(async()=>{
        server=require("../../app");
        await database.insert('laboratory',null,['1','Lab1','1',3,true]);
        await database.insert("equipment_type",null,["1","a","a"]);
        await database.insert("equipment",null,["1","1","a","1","10/11/2021",0,"some a"]);
        await database.insert("equipment",null,["2","1","a","1","10/11/2021",1,"some a"]);
        await database.insert("equipment",null,["3","1","a","1","10/11/2021",2,"some a"]);
        await database.insert("equipment",null,["4","1","a","1","10/11/2021",3,"some a"]);
        await database.insert("equipment",null,["5","1","a","1","10/11/2021",4,"some a"]);
        await database.insert("equipment",null,["6","1","a","1","10/11/2021",5,"some a"]);
        await database.insert("assigned_t_o",null,["10000","1"]);

    })
    afterEach(async()=>{
        server.close();
        await database.clear('laboratory');
        await database.clear("assigned_t_o");
        await database.clear("equipment");
        await database.clear("equipment_type");

    });

    it("Should show available equipments",async ()=>{
        await request(server).get("/techOff/viewAvailableEquips").set('Accept','application/json').set("Cookie",`auth-token=${token}`).then(async(res)=>{
            expect(res.status).toBe(200);
            // console.log(res.body)
            expect(res.body.data.some(i=>i.eq_id=='1')).toBeTruthy();
            expect(res.body.data.length).toBe(1);

        });
    });
});

describe("/getEquipTypes",()=>{
    let database=new Database();
    beforeEach(async()=>{
        server=require("../../app");
        await database.insert("equipment_type",null,["1","a","a"]);
        await database.insert("equipment_type",null,["2","a","a"]);
        await database.insert("equipment_type",null,["3","a","a"]); 
    })
    afterEach(async()=>{
        server.close();
        await database.clear("equipment_type");

    });

    it("Should show equipment types",async ()=>{
        await request(server).get("/techOff/getEquipTypes").set('Accept','application/json').set("Cookie",`auth-token=${token}`).then(async(res)=>{
            expect(res.status).toBe(200);
            // console.log(res.body)
            expect(res.body.data.some(i=>i.typeId=='1')).toBeTruthy();
            expect(res.body.data.some(i=>i.typeId=='2')).toBeTruthy();
            expect(res.body.data.some(i=>i.typeId=='3')).toBeTruthy();
            expect(res.body.data.length).toBe(3);

        });
    });
});