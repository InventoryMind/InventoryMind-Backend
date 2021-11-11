const request = require("supertest");
let server;
const dotenv=require('dotenv');
dotenv.config();
const Database=require("../../database/database");

process.env.db="InventoryMindTest"
process.env.host="localhost"
process.env.user="postgres"
process.env.password="123"

let token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMDAwMCIsImVtYWlsIjoiaW52ZW50b3J5bWluZEBnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJJbnZlbnRvcnkiLCJsYXN0TmFtZSI6IlRlc3QiLCJ1c2VyVHlwZSI6ImxlY3R1cmVyIiwiaWF0IjoxNjM2NjIxNjA4LCJleHAiOjE2MzY3MDgwMDh9.ptvNXv15mFB7NlPZ9VuVQzqtG6pGuYOw3F76Jl6sYio";

describe("/approve/:id",()=>{
    let database=new Database();
    beforeEach(async()=>{
        server=require("../../app");
        await database.insert("student",null,["100001","f","f","a@xy.com","sffsf","0777123456",true]);
        await database.insert('laboratory',null,['1','Lab1','1',3,true]);
        await database.insert("equipment_type",null,["1","a","a"]);
        await database.insert("equipment",null,["1","1","a","1","10/11/2021",0,"a"]);
        await database.insert("request",null,["1","100001","10000","11/10/2021","12/10/2021","a",0]);
        await database.insert("requested_equipments",null,["1","1"]);
        
    })
    afterEach(async()=>{
        server.close();
        await database.delete("laboratory",["lab_id","=","1"]);
        await database.clear("requested_equipments");
        await database.clear("equipment");
        await database.clear("normal_borrowing");
        await database.clear("request");
        await database.clear("equipment_type");
        await database.delete("student",["user_id","=","100001"]);
       
    });

    it("Should approve request",async ()=>{
    
        await request(server).post("/lecturer/approve/1").set('Accept','application/json').set("Cookie",`auth-token=${token}`).then(async(res)=>{
            expect(res.status).toBe(200);
            let d=await database.readSingleTable("normal_borrowing",null,["request_id","=","1"]);
            expect(d.result.rows[0].request_id).toBe("1");
        });
    });
});

describe("/reject/:id",()=>{
    let database=new Database();
    beforeEach(async()=>{
        server=require("../../app");
        await database.insert("student",null,["100001","f","f","a@xy.com","sffsf","0777123456",true]);
        await database.insert('laboratory',null,['1','Lab1','1',3,true]);
        await database.insert("equipment_type",null,["1","a","a"]);
        await database.insert("equipment",null,["1","1","a","1","10/11/2021",0,"a"]);
        await database.insert("request",null,["1","100001","10000","11/10/2021","12/10/2021","a",0]);
        await database.insert("requested_equipments",null,["1","1"]);
        
    })
    afterEach(async()=>{
        server.close();
        await database.delete("laboratory",["lab_id","=","1"]);
        await database.clear("requested_equipments");
        await database.clear("equipment");
        await database.clear("normal_borrowing");
        await database.clear("request");
        await database.clear("equipment_type");
        await database.delete("student",["user_id","=","100001"]);
       
    });

    it("Should reject request",async ()=>{
    
        await request(server).post("/lecturer/reject/1").set('Accept','application/json').set("Cookie",`auth-token=${token}`).then(async(res)=>{
            expect(res.status).toBe(200);
            let d=await database.readSingleTable("normal_borrowing",null,["request_id","=","1"]);
            expect(d.result.rows[0]).toBe(undefined);
        });
    });
});

describe("/getDashboardDataM",()=>{
    beforeEach(async()=>{
        server=require("../../app");
        let database=new Database();
        await database.insert("student",null,["100001","f","f","a@xy.com","sffsf","0777123456",true]);
        await database.insert('laboratory',null,['1','Lab1','1',3,true]);
        await database.insert("equipment_type",null,["1","a","a"]);
        await database.insert("equipment",null,["1","1","a","1","10/11/2021",3,"a"]);
        await database.insert("equipment",null,["2","1","a","1","10/11/2021",2,"a"]);
        await database.insert("equipment",null,["3","1","a","1","10/11/2021",2,"a"]);
        await database.insert("request",null,["1","100001","10000","11/10/2021","12/10/2021","a",0]);
        await database.insert("request",null,["2","100001","10000","11/10/2021","12/10/2021","a",1]);
        await database.insert("request",null,["3","100001","10000","11/10/2021","12/10/2021","a",2]);

        await database.insert("requested_equipments",null,["1","1"]);

    })
    afterEach(async()=>{
        server.close();
        let database=new Database();
        await database.delete("laboratory",["lab_id","=","1"]);
        await database.clear("requested_equipments");
        await database.clear("equipment");
        await database.clear("request");
        await database.clear("equipment_type");
        await database.delete("student",["user_id","=","100001"]);
    });

    it("Should get dashboard data",async ()=>{
        await request(server).get("/lecturer/getDashboardDataM").set('Accept','application/json').set("Cookie",`auth-token=${token}`).then(async(res)=>{
            expect(res.status).toBe(200);
            expect(res.body.msg.data[0].count).toBe("1");
            expect(res.body.msg.data[1].count).toBe("1");
            expect(res.body.msg.data[2].count).toBe("1");
        });
    });
},1000000);

describe("/getUserDetails",()=>{
    beforeEach(async()=>{
        server=require("../../app");        
    })
    afterEach(async()=>{
        server.close();
    });

    it("Should view details",async ()=>{
        await request(server).get("/lecturer/getUserDetails").set('Accept','application/json').set("Cookie",`auth-token=${token}`).then((res)=>{
            expect(res.status).toBe(200);
        });
    });
});


describe("/viewAllRequest",()=>{
    beforeEach(async()=>{
        server=require("../../app");
        let database=new Database();
        await database.insert("student",null,["100001","f","f","a@xy.com","sffsf","0777123456",true]);
        await database.insert('laboratory',null,['1','Lab1','1',3,true]);
        await database.insert("equipment_type",null,["1","a","a"]);
        await database.insert("equipment",null,["1","1","a","1","10/11/2021",0,"a"]);
        await database.insert("equipment",null,["2","1","a","1","10/11/2021",0,"a"]);
        await database.insert("equipment",null,["3","1","a","1","10/11/2021",0,"a"]);
        await database.insert("request",null,["1","100001","10000","11/10/2021","13/10/2021","a",1]);
        await database.insert("request",null,["2","100001","10000","11/10/2021","13/10/2021","a",1]);
        await database.insert("request",null,["3","100001","10000","11/10/2021","13/10/2021","a",2]);
        await database.insert("requested_equipments",null,["1","1"]);
        await database.insert("requested_equipments",null,["2","2"]);
        await database.insert("requested_equipments",null,["3","3"]);
    })
    afterEach(async()=>{
        server.close();
        let database=new Database();
        await database.delete("laboratory",["lab_id","=","1"]);
        await database.clear("requested_equipments");
        await database.clear("equipment");
        await database.clear("request");
        await database.clear("equipment_type");
        await database.delete("lecturer",["user_id","=","100001"]);
        await database.delete("student",["user_id","=","100001"]);
    });

    it("Should show all request",async ()=>{
        await request(server).get("/lecturer/viewAllRequest").set('Accept','application/json').set("Cookie",`auth-token=${token}`).then((res)=>{
            expect(res.status).toBe(200);
            expect(res.body.msg.some(i=>i.requestId=='1')).toBeTruthy();
            expect(res.body.msg.some(i=>i.requestId=='2')).toBeTruthy();
            expect(res.body.msg.some(i=>i.requestId=='3')).toBeTruthy();
            expect(res.body.msg.length).toBe(3);
        });
    })
});


describe("/viewAcceptedRequest",()=>{
    beforeEach(async()=>{
        server=require("../../app");
        let database=new Database();
        await database.insert("student",null,["100001","f","f","a@xy.com","sffsf","0777123456",true]);
        await database.insert('laboratory',null,['1','Lab1','1',3,true]);
        await database.insert("equipment_type",null,["1","a","a"]);
        await database.insert("equipment",null,["1","1","a","1","10/11/2021",0,"a"]);
        await database.insert("equipment",null,["2","1","a","1","10/11/2021",0,"a"]);
        await database.insert("equipment",null,["3","1","a","1","10/11/2021",0,"a"]);
        await database.insert("request",null,["1","100001","10000","11/10/2021","13/10/2021","a",0]);
        await database.insert("request",null,["2","100001","10000","11/10/2021","13/10/2021","a",1]);
        await database.insert("request",null,["3","100001","10000","11/10/2021","13/10/2021","a",2]);
        await database.insert("requested_equipments",null,["1","1"]);
        await database.insert("requested_equipments",null,["2","2"]);
        await database.insert("requested_equipments",null,["3","3"]);
    })
    afterEach(async()=>{
        server.close();
        let database=new Database();
        await database.delete("laboratory",["lab_id","=","1"]);
        await database.clear("requested_equipments");
        await database.clear("equipment");
        await database.clear("request");
        await database.clear("equipment_type");
        await database.delete("lecturer",["user_id","=","100001"]);
        await database.delete("student",["user_id","=","100001"]);
    });

    it("Should show accepted request",async ()=>{
        await request(server).get("/lecturer/viewAcceptedRequests").set('Accept','application/json').set("Cookie",`auth-token=${token}`).then((res)=>{
            expect(res.status).toBe(200);
           expect(res.body.msg.every(i=>i.state=="Accepted")).toBeTruthy();
            expect(res.body.msg.length).toBe(1);
        });
    })
});


describe("/viewRejectedRequest",()=>{
    beforeEach(async()=>{
        server=require("../../app");
        let database=new Database();
        await database.insert("student",null,["100001","f","f","a@xy.com","sffsf","0777123456",true]);
        await database.insert('laboratory',null,['1','Lab1','1',3,true]);
        await database.insert("equipment_type",null,["1","a","a"]);
        await database.insert("equipment",null,["1","1","a","1","10/11/2021",0,"a"]);
        await database.insert("equipment",null,["2","1","a","1","10/11/2021",0,"a"]);
        await database.insert("equipment",null,["3","1","a","1","10/11/2021",0,"a"]);
        await database.insert("request",null,["1","100001","10000","11/10/2021","13/10/2021","a",0]);
        await database.insert("request",null,["2","100001","10000","11/10/2021","13/10/2021","a",1]);
        await database.insert("request",null,["3","100001","10000","11/10/2021","13/10/2021","a",2]);
        await database.insert("requested_equipments",null,["1","1"]);
        await database.insert("requested_equipments",null,["2","2"]);
        await database.insert("requested_equipments",null,["3","3"]);
    })
    afterEach(async()=>{
        server.close();
        let database=new Database();
        await database.delete("laboratory",["lab_id","=","1"]);
        await database.clear("requested_equipments");
        await database.clear("equipment");
        await database.clear("request");
        await database.clear("equipment_type");
        await database.delete("lecturer",["user_id","=","100001"]);
        await database.delete("student",["user_id","=","100001"]);
    });

    it("Should show accepted request",async ()=>{
        await request(server).get("/lecturer/viewRejectedRequests").set('Accept','application/json').set("Cookie",`auth-token=${token}`).then((res)=>{
            expect(res.status).toBe(200);
           expect(res.body.msg.every(i=>i.state=="Rejected")).toBeTruthy();
            expect(res.body.msg.length).toBe(1);
        });
    })
});


describe("/viewPendingRequest",()=>{
    beforeEach(async()=>{
        server=require("../../app");
        let database=new Database();
        await database.insert("student",null,["100001","f","f","a@xy.com","sffsf","0777123456",true]);
        await database.insert('laboratory',null,['1','Lab1','1',3,true]);
        await database.insert("equipment_type",null,["1","a","a"]);
        await database.insert("equipment",null,["1","1","a","1","10/11/2021",0,"a"]);
        await database.insert("equipment",null,["2","1","a","1","10/11/2021",0,"a"]);
        await database.insert("equipment",null,["3","1","a","1","10/11/2021",0,"a"]);
        await database.insert("request",null,["1","100001","10000","11/10/2021","13/10/2021","a",0]);
        await database.insert("request",null,["2","100001","10000","11/10/2021","13/10/2021","a",1]);
        await database.insert("request",null,["3","100001","10000","11/10/2021","13/10/2021","a",2]);
        await database.insert("requested_equipments",null,["1","1"]);
        await database.insert("requested_equipments",null,["2","2"]);
        await database.insert("requested_equipments",null,["3","3"]);
    })
    afterEach(async()=>{
        server.close();
        let database=new Database();
        await database.delete("laboratory",["lab_id","=","1"]);
        await database.clear("requested_equipments");
        await database.clear("equipment");
        await database.clear("request");
        await database.clear("equipment_type");
        await database.delete("lecturer",["user_id","=","100001"]);
        await database.delete("student",["user_id","=","100001"]);
    });

    it("Should show pending request",async ()=>{
        await request(server).get("/lecturer/viewPendingRequest").set('Accept','application/json').set("Cookie",`auth-token=${token}`).then((res)=>{
            expect(res.status).toBe(200);
           expect(res.body.msg.every(i=>i.state=="Pending")).toBeTruthy();
            expect(res.body.msg.length).toBe(1);
        });
    })
});

describe("/viewRequest/:id",()=>{
    beforeEach(async()=>{
        server=require("../../app");
        let database=new Database();
        await database.insert("student",null,["100001","f","f","a@xy.com","sffsf","0777123456",true]);
        await database.insert('laboratory',null,['1','Lab1','1',3,true]);
        await database.insert("equipment_type",null,["1","a","a"]);
        await database.insert("equipment",null,["1","1","a","1","10/11/2021",0,"a"]);
        await database.insert("request",null,["1","100001","10000","11/10/2021","12/10/2021","a",0]);
        await database.insert("requested_equipments",null,["1","1"]);
        
    })
    afterEach(async()=>{
        server.close();
        let database=new Database();
        await database.delete("laboratory",["lab_id","=","1"]);
        await database.clear("requested_equipments");
        await database.clear("equipment");
        await database.clear("request");
        await database.clear("equipment_type");
        await database.delete("student",["user_id","=","100001"]);
       
    });

    it("Should show request details",async ()=>{
        await request(server).get("/lecturer/viewRequest/1").set('Accept','application/json').set("Cookie",`auth-token=${token}`).then((res)=>{
            expect(res.status).toBe(200);
            expect(res.body.msg.request_id).toBe("1");
        });
    });
},500000);
