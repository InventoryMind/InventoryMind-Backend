const request = require("supertest");
let server;
const dotenv=require('dotenv');
dotenv.config();
const Database=require("../../database/database");

process.env.db="InventoryMindTest"
process.env.host="localhost"
process.env.user="postgres"
process.env.password="123"

describe("/register",()=>{
    beforeEach(()=>{
        server=require("../../app");
    })
    afterEach(async()=>{
        server.close();
        let database=new Database();
        await database.delete("student",["user_id","=","100001"])
    });

    it("Should register student",async ()=>{
        await request(server).post("/student/register").set('Accept','application/json').send({userId:"100001",firstName:"Sri",lastName:"Thuva",contactNo:"0777123456",email:"dtsh14@gmail.com"}).then((res)=>{
            expect(res.status).toBe(200)
        });
    })
});

describe("/viewAllRequest",()=>{
    beforeEach(async()=>{
        server=require("../../app");
        let database=new Database();
        await database.insert("lecturer",null,["100001","f","f","a@xy.com","sffsf","0777123456",true]);
        await database.insert('laboratory',null,['1','Lab1','1',3,true]);
        await database.insert("equipment_type",null,["1","a","a"]);
        await database.insert("equipment",null,["1","1","a","1","10/11/2021",0,"a"]);
        await database.insert("equipment",null,["2","1","a","1","10/11/2021",0,"a"]);
        await database.insert("equipment",null,["3","1","a","1","10/11/2021",0,"a"]);
        await database.insert("request",null,["1","10000","100001","11/10/2021","13/10/2021","a",0]);
        await database.insert("request",null,["2","10000","100001","11/10/2021","13/10/2021","a",1]);
        await database.insert("request",null,["3","10000","100001","11/10/2021","13/10/2021","a",2]);
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
        await request(server).get("/student/viewAllRequest").set('Accept','application/json').set("Cookie","auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMDAwMCIsImVtYWlsIjoiaW52ZW50b3J5bWluZEBnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJJbnZlbnRvcnkiLCJsYXN0TmFtZSI6IlRlc3QiLCJ1c2VyVHlwZSI6InN0dWRlbnQiLCJpYXQiOjE2MzY1OTc3OTEsImV4cCI6MTYzNjY4NDE5MX0.GjFrzAnLxSpy5mch1uQGSUwlwjJQYhW1ldCr-x8sblw").then((res)=>{
            expect(res.status).toBe(200);
            expect(res.body.msg.some(i=>i.requestId=='1')).toBeTruthy();
            expect(res.body.msg.some(i=>i.requestId=='2')).toBeTruthy();
            expect(res.body.msg.some(i=>i.requestId=='3')).toBeTruthy();

        });
    })
});

describe("/viewRequest/:id",()=>{
    beforeEach(async()=>{
        server=require("../../app");
        let database=new Database();
        await database.insert("lecturer",null,["100001","f","f","a@xy.com","sffsf","0777123456",true]);
        await database.insert('laboratory',null,['1','Lab1','1',3,true]);
        await database.insert("equipment_type",null,["1","a","a"]);
        await database.insert("equipment",null,["1","1","a","1","10/11/2021",0,"a"]);
        await database.insert("request",null,["1","10000","100001","11/10/2021","13/10/2021","a",0]);
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
        await database.delete("lecturer",["user_id","=","100001"]);
       
    });

    it("Should show request details",async ()=>{
        await request(server).get("/student/viewRequest/1").set('Accept','application/json').set("Cookie","auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMDAwMCIsImVtYWlsIjoiaW52ZW50b3J5bWluZEBnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJJbnZlbnRvcnkiLCJsYXN0TmFtZSI6IlRlc3QiLCJ1c2VyVHlwZSI6InN0dWRlbnQiLCJpYXQiOjE2MzY1OTc3OTEsImV4cCI6MTYzNjY4NDE5MX0.GjFrzAnLxSpy5mch1uQGSUwlwjJQYhW1ldCr-x8sblw").then((res)=>{
            expect(res.status).toBe(200);
            expect(res.body.msg.request_id).toBe("1");
        });
    });
});

describe("/getDashboardDataM",()=>{
    beforeEach(async()=>{
        server=require("../../app");
        let database=new Database();
        await database.insert("lecturer",null,["100001","f","f","a@xy.com","sffsf","0777123456",true]);
        await database.insert('laboratory',null,['1','Lab1','1',3,true]);
        await database.insert("equipment_type",null,["1","a","a"]);
        await database.insert("equipment",null,["1","1","a","1","10/11/2021",3,"a"]);
        await database.insert("request",null,["1","10000","100001","11/10/2021","13/10/2021","a",0]);
        await database.update("request",["state","=",1,"request_id","=","1"]);
        await database.insert("requested_equipments",null,["1","1"]);
        await database.insert("equipment",null,["2","1","a","1","10/11/2021",2,"a"]);
        await database.insert("temporary_borrowing",null,["1","10000","11/10/2021","a",0]);
        await database.insert("temporary_borrowed_equipments",null,["1","2"]);

    })
    afterEach(async()=>{
        server.close();
        let database=new Database();
        await database.delete("laboratory",["lab_id","=","1"]);
        await database.clear("normal_borrowing");
        await database.clear("requested_equipments");
        await database.clear("temporary_borrowed_equipments");
        await database.clear("temporary_borrowing");
        await database.clear("equipment");
        await database.clear("request");
        await database.clear("equipment_type");
        await database.delete("lecturer",["user_id","=","100001"]);
    });

    it("Should get dashboard data",async ()=>{
        await request(server).get("/student/getDashboardDataM").set('Accept','application/json').set("Cookie","auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMDAwMCIsImVtYWlsIjoiaW52ZW50b3J5bWluZEBnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJJbnZlbnRvcnkiLCJsYXN0TmFtZSI6IlRlc3QiLCJ1c2VyVHlwZSI6InN0dWRlbnQiLCJpYXQiOjE2MzY1OTc3OTEsImV4cCI6MTYzNjY4NDE5MX0.GjFrzAnLxSpy5mch1uQGSUwlwjJQYhW1ldCr-x8sblw").then((res)=>{
            expect(res.status).toBe(200);
            expect(res.body.msg.some(i=>i.requestId=="1" && i.type=="Normal Borrowed")).toBeTruthy();
            expect(res.body.msg.some(i=>i.borrowId=="1" && i.type=="Temporary Borrowed")).toBeTruthy();
        });
    });
});

describe("/viewBorrowedHistory",()=>{
    beforeEach(async()=>{
        server=require("../../app");
        let database=new Database();
        await database.insert("lecturer",null,["100001","f","f","a@xy.com","sffsf","0777123456",true]);
        await database.insert('laboratory',null,['1','Lab1','1',3,true]);
        await database.insert("equipment_type",null,["1","a","a"]);
        await database.insert("equipment",null,["1","1","a","1","10/11/2021",3,"a"]);
        await database.insert("request",null,["1","10000","100001","11/10/2021","13/10/2021","a",0]);
        await database.update("request",["state","=",1,"request_id","=","1"]);
        await database.insert("requested_equipments",null,["1","1"]);
        await database.insert("equipment",null,["2","1","a","1","10/11/2021",2,"a"]);
        await database.insert("temporary_borrowing",null,["1","10000","11/10/2021","a",0]);
        await database.insert("temporary_borrowed_equipments",null,["1","2"]);

    })
    afterEach(async()=>{
        server.close();
        let database=new Database();
        await database.delete("laboratory",["lab_id","=","1"]);
        await database.clear("normal_borrowing");
        await database.clear("requested_equipments");
        await database.clear("temporary_borrowed_equipments");
        await database.clear("temporary_borrowing");
        await database.clear("equipment");
        await database.clear("request");
        await database.clear("equipment_type");
        await database.delete("lecturer",["user_id","=","100001"]);
    });

    it("Should get borrowed history",async ()=>{
        await request(server).get("/student/viewBorrowedHistory").set('Accept','application/json').set("Cookie","auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMDAwMCIsImVtYWlsIjoiaW52ZW50b3J5bWluZEBnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJJbnZlbnRvcnkiLCJsYXN0TmFtZSI6IlRlc3QiLCJ1c2VyVHlwZSI6InN0dWRlbnQiLCJpYXQiOjE2MzY1OTc3OTEsImV4cCI6MTYzNjY4NDE5MX0.GjFrzAnLxSpy5mch1uQGSUwlwjJQYhW1ldCr-x8sblw").then((res)=>{
            expect(res.status).toBe(200);
            expect(res.body.msg.some(i=>i.requestId=="1" && i.type=="Normal Borrowed")).toBeTruthy();
            expect(res.body.msg.some(i=>i.borrowId=="1" && i.type=="Temporary Borrowed")).toBeTruthy();
        });
    });
});

describe("/viewBorrowDetals",()=>{
    beforeEach(async()=>{
        server=require("../../app");
        let database=new Database();
        await database.query("alter sequence normal_borrowing_borrow_id_seq restart with 1");
        await database.insert("lecturer",null,["100001","f","f","a@xy.com","sffsf","0777123456",true]);
        await database.insert('laboratory',null,['1','Lab1','1',3,true]);
        await database.insert("equipment_type",null,["1","a","a"]);
        await database.insert("equipment",null,["1","1","a","1","10/11/2021",3,"a"]);
        await database.insert("request",null,["1","10000","100001","11/10/2021","13/10/2021","a",0]);
        await database.update("request",["state","=",1,"request_id","=","1"]);
        await database.insert("requested_equipments",null,["1","1"]);
        await database.insert("equipment",null,["2","1","a","1","10/11/2021",2,"a"]);
        await database.insert("temporary_borrowing",null,["1","10000","11/10/2021","a",0]);
        await database.insert("temporary_borrowed_equipments",null,["1","2"]);

    })
    afterEach(async()=>{
        server.close();
        let database=new Database();
        await database.delete("laboratory",["lab_id","=","1"]);
        await database.clear("normal_borrowing");
        await database.clear("requested_equipments");
        await database.clear("temporary_borrowed_equipments");
        await database.clear("temporary_borrowing");
        await database.clear("equipment");
        await database.clear("request");
        await database.clear("equipment_type");
        await database.delete("lecturer",["user_id","=","100001"]);
    });

    it("Should get normal borrow detail",async ()=>{
        await request(server).post("/student/viewBorrow").set('Accept','application/json').set("Cookie","auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMDAwMCIsImVtYWlsIjoiaW52ZW50b3J5bWluZEBnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJJbnZlbnRvcnkiLCJsYXN0TmFtZSI6IlRlc3QiLCJ1c2VyVHlwZSI6InN0dWRlbnQiLCJpYXQiOjE2MzY1OTc3OTEsImV4cCI6MTYzNjY4NDE5MX0.GjFrzAnLxSpy5mch1uQGSUwlwjJQYhW1ldCr-x8sblw").send({borrowId:'1',type:'normal'}).then((res)=>{
            expect(res.status).toBe(200);
            expect(res.body.msg.borrow_id).toBe(1);
            expect(res.body.msg.types['1']['count']).toBe(1);
        });
    });

    
    it("Should get temporary borrow detail",async ()=>{
        await request(server).post("/student/viewBorrow").set('Accept','application/json').set("Cookie","auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMDAwMCIsImVtYWlsIjoiaW52ZW50b3J5bWluZEBnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJJbnZlbnRvcnkiLCJsYXN0TmFtZSI6IlRlc3QiLCJ1c2VyVHlwZSI6InN0dWRlbnQiLCJpYXQiOjE2MzY1OTc3OTEsImV4cCI6MTYzNjY4NDE5MX0.GjFrzAnLxSpy5mch1uQGSUwlwjJQYhW1ldCr-x8sblw").send({borrowId:'1',type:'temporary'}).then((res)=>{
            expect(res.status).toBe(200);
            expect(res.body.msg.borrow_id).toBe(1);
            expect(res.body.msg.types['1']['count']).toBe(1);
        });
    });
});

describe("/getLecturerList",()=>{
    beforeEach(async()=>{
        server=require("../../app");
        let database=new Database();
        await database.insert("lecturer",null,["100001","f","f","a@xy.com","sffsf","0777123456",true]);
        await database.insert("lecturer",null,["100002","f","f","b@xy.com","sffsf","0777123456",true]);
        
    })
    afterEach(async()=>{
        server.close();
        let database=new Database();
        await database.delete("lecturer",["user_id","!=","10000"]);
    });

    it("Should show lecturer list",async ()=>{
        await request(server).get("/student/getLecturerList").set('Accept','application/json').set("Cookie","auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMDAwMCIsImVtYWlsIjoiaW52ZW50b3J5bWluZEBnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJJbnZlbnRvcnkiLCJsYXN0TmFtZSI6IlRlc3QiLCJ1c2VyVHlwZSI6InN0dWRlbnQiLCJpYXQiOjE2MzY1OTc3OTEsImV4cCI6MTYzNjY4NDE5MX0.GjFrzAnLxSpy5mch1uQGSUwlwjJQYhW1ldCr-x8sblw").then((res)=>{
            expect(res.status).toBe(200);
            expect(res.body.msg.some(i=>i.user_id=="100001")).toBeTruthy();
            expect(res.body.msg.some(i=>i.user_id=="100002")).toBeTruthy();

        });
    });
});

describe("/getLabList",()=>{
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
        await request(server).get("/student/getLabList").set('Accept','application/json').set("Cookie","auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMDAwMCIsImVtYWlsIjoiaW52ZW50b3J5bWluZEBnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJJbnZlbnRvcnkiLCJsYXN0TmFtZSI6IlRlc3QiLCJ1c2VyVHlwZSI6InN0dWRlbnQiLCJpYXQiOjE2MzY1OTc3OTEsImV4cCI6MTYzNjY4NDE5MX0.GjFrzAnLxSpy5mch1uQGSUwlwjJQYhW1ldCr-x8sblw").then((res)=>{
            expect(res.status).toBe(200);
            expect(res.body.msg.some(i=>i.lab_id=="1")).toBeTruthy();
            expect(res.body.msg.some(i=>i.lab_id=="2")).toBeTruthy();
            expect(res.body.msg.some(i=>i.lab_id=="3")).toBeTruthy();
        });
    });
});

describe("/getUserDetails",()=>{
    beforeEach(async()=>{
        server=require("../../app");        
    })
    afterEach(async()=>{
        server.close();
    });

    it("Should view details",async ()=>{
        await request(server).get("/student/getUserDetails").set('Accept','application/json').set("Cookie","auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMDAwMCIsImVtYWlsIjoiaW52ZW50b3J5bWluZEBnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJJbnZlbnRvcnkiLCJsYXN0TmFtZSI6IlRlc3QiLCJ1c2VyVHlwZSI6InN0dWRlbnQiLCJpYXQiOjE2MzY1OTc3OTEsImV4cCI6MTYzNjY4NDE5MX0.GjFrzAnLxSpy5mch1uQGSUwlwjJQYhW1ldCr-x8sblw").then((res)=>{
            expect(res.status).toBe(200);
        });
    });
});
