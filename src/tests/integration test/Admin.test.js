const request = require("supertest");
let server;
const dotenv=require('dotenv');
dotenv.config();
const Database=require("../../database/database");

process.env.db="InventoryMindTest"
process.env.host="localhost"
process.env.user="postgres"
process.env.password="123"

describe("/addStaff",()=>{
    beforeEach(()=>{
        server=require("../../app");
    })
    afterEach(async()=>{
        server.close();
        let database=new Database();
        await database.delete("lecturer",["user_id","=","100001"])
    });

    it("Should not add staff",async ()=>{
        await request(server).post("/admin/addStaff").set('Accept','application/json').set("Cookie","auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMDAwMCIsImVtYWlsIjoiaW52ZW50b3J5bWluZEBnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJJbnZlbnRvcnkiLCJsYXN0TmFtZSI6IlRlc3QiLCJ1c2VyVHlwZSI6ImFkbWluaXN0cmF0b3IiLCJpYXQiOjE2MzY1NDYwNTYsImV4cCI6MTYzNjYzMjQ1Nn0.TgEksu1WHf_wMWS1X_Bkej3Q3__apyR7hLQLWfa6ADY").send({userId:"100001",firstName:"Sri",lastName:"Thuva",userType:"lecturer",contactNo:"0777123456",email:""}).then((res)=>{
            expect(res.status).toBe(400)
        });
    })

    it("Should add staff",async ()=>{
        await request(server).post("/admin/addStaff").set('Accept','application/json').set("Cookie","auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMDAwMCIsImVtYWlsIjoiaW52ZW50b3J5bWluZEBnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJJbnZlbnRvcnkiLCJsYXN0TmFtZSI6IlRlc3QiLCJ1c2VyVHlwZSI6ImFkbWluaXN0cmF0b3IiLCJpYXQiOjE2MzY1NDYwNTYsImV4cCI6MTYzNjYzMjQ1Nn0.TgEksu1WHf_wMWS1X_Bkej3Q3__apyR7hLQLWfa6ADY").send({userId:"100001",firstName:"Sri",lastName:"Thuva",userType:"lecturer",contactNo:"0777123456",email:"dtsh14@gmail.com"}).then((res)=>{
            expect(res.status).toBe(200)
        });
    })
});

describe("/removeStaff",()=>{
    beforeEach(async()=>{
        server=require("../../app");
        let database=new Database();
        await database.insert("lecturer",null,["100001","f","f","a@xy.com","sffsf","0777123456",true]);
    })
    afterEach(async()=>{
        server.close();
        let database=new Database();
        await database.delete("lecturer",["user_id","=","100001"]);
    });

    it("Should remove staff",async ()=>{
        await request(server).post("/admin/removeUser").set('Accept','application/json').set("Cookie","auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMDAwMCIsImVtYWlsIjoiaW52ZW50b3J5bWluZEBnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJJbnZlbnRvcnkiLCJsYXN0TmFtZSI6IlRlc3QiLCJ1c2VyVHlwZSI6ImFkbWluaXN0cmF0b3IiLCJpYXQiOjE2MzY1NDYwNTYsImV4cCI6MTYzNjYzMjQ1Nn0.TgEksu1WHf_wMWS1X_Bkej3Q3__apyR7hLQLWfa6ADY").send({userId:"100001",userType:"lecturer"}).then((res)=>{
            expect(res.status).toBe(200)
        });
    })
})

describe("/assignTO",()=>{
    beforeEach(async()=>{
        let database=new Database();
        await database.insert('laboratory',null,['1','Lab1','1',3,true]);
        await database.insert("technical_officer",null,["100001","f","f","a@xy.com","sffsf","0777123456",true]);
        server=require("../../app");
    })
    afterEach(async()=>{
        server.close();
        let database=new Database();
        await database.clear('laboratory');
        await database.clear("assigned_t_o");
        await database.delete("technical_officer",["user_id","=","100001"])
    });

    it("Should assign staff",async ()=>{
        await request(server).post("/admin/assignTO").set('Accept','application/json').set("Cookie","auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMDAwMCIsImVtYWlsIjoiaW52ZW50b3J5bWluZEBnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJJbnZlbnRvcnkiLCJsYXN0TmFtZSI6IlRlc3QiLCJ1c2VyVHlwZSI6ImFkbWluaXN0cmF0b3IiLCJpYXQiOjE2MzY1NDYwNTYsImV4cCI6MTYzNjYzMjQ1Nn0.TgEksu1WHf_wMWS1X_Bkej3Q3__apyR7hLQLWfa6ADY").send({labId:"1",T_OId:"100001"}).then((res)=>{
            expect(res.status).toBe(200);
            expect(res.body.title).toBe("Success");
        });
    });

    it("Should return failed",async ()=>{
        await request(server).post("/admin/assignTO").set('Accept','application/json').set("Cookie","auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMDAwMCIsImVtYWlsIjoiaW52ZW50b3J5bWluZEBnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJJbnZlbnRvcnkiLCJsYXN0TmFtZSI6IlRlc3QiLCJ1c2VyVHlwZSI6ImFkbWluaXN0cmF0b3IiLCJpYXQiOjE2MzY1NDYwNTYsImV4cCI6MTYzNjYzMjQ1Nn0.TgEksu1WHf_wMWS1X_Bkej3Q3__apyR7hLQLWfa6ADY").send({labId:"1",T_OId:"10011001"}).then((res)=>{
            expect(res.status).toBe(200);
            expect(res.body.title).toBe("Failed");
        });
    })

    it("Should return validation error",async ()=>{
        await request(server).post("/admin/assignTO").set('Accept','application/json').set("Cookie","auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMDAwMCIsImVtYWlsIjoiaW52ZW50b3J5bWluZEBnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJJbnZlbnRvcnkiLCJsYXN0TmFtZSI6IlRlc3QiLCJ1c2VyVHlwZSI6ImFkbWluaXN0cmF0b3IiLCJpYXQiOjE2MzY1NDYwNTYsImV4cCI6MTYzNjYzMjQ1Nn0.TgEksu1WHf_wMWS1X_Bkej3Q3__apyR7hLQLWfa6ADY").send({labId:"1",T_OId:""}).then((res)=>{
            expect(res.status).toBe(400)
        });
    });
});

describe("/addLaboratory",()=>{
    beforeEach(async()=>{
        server=require("../../app");
    })
    afterEach(async()=>{
        server.close();
        let database=new Database();
        await database.clear('laboratory');
    });

    it("Should remove staff",async ()=>{
        await request(server).post("/admin/addLaboratory").set('Accept','application/json').set("Cookie","auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMDAwMCIsImVtYWlsIjoiaW52ZW50b3J5bWluZEBnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJJbnZlbnRvcnkiLCJsYXN0TmFtZSI6IlRlc3QiLCJ1c2VyVHlwZSI6ImFkbWluaXN0cmF0b3IiLCJpYXQiOjE2MzY1NDYwNTYsImV4cCI6MTYzNjYzMjQ1Nn0.TgEksu1WHf_wMWS1X_Bkej3Q3__apyR7hLQLWfa6ADY").send({labId:"1",name:"test",building:"1",floor:3}).then((res)=>{
            expect(res.status).toBe(200);
            expect(res.body.title).toBe("Success");
        });
    });

    it("Should return validation error",async ()=>{
        await request(server).post("/admin/addLaboratory").set('Accept','application/json').set("Cookie","auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMDAwMCIsImVtYWlsIjoiaW52ZW50b3J5bWluZEBnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJJbnZlbnRvcnkiLCJsYXN0TmFtZSI6IlRlc3QiLCJ1c2VyVHlwZSI6ImFkbWluaXN0cmF0b3IiLCJpYXQiOjE2MzY1NDYwNTYsImV4cCI6MTYzNjYzMjQ1Nn0.TgEksu1WHf_wMWS1X_Bkej3Q3__apyR7hLQLWfa6ADY").send({labId:"",name:"test",building:"1",floor:3}).then((res)=>{
            expect(res.status).toBe(400)
        });
    });
});

describe("/removeLaboratory",()=>{
    beforeEach(async()=>{
        server=require("../../app");
        let database=new Database();
        await database.insert('laboratory',null,['1','Lab1','1',3,true]);
    })
    afterEach(async()=>{
        server.close();
        let database=new Database();
        await database.clear('laboratory');
    });

    it("Should remove staff",async ()=>{
        await request(server).post("/admin/removeLaboratory").set('Accept','application/json').set("Cookie","auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMDAwMCIsImVtYWlsIjoiaW52ZW50b3J5bWluZEBnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJJbnZlbnRvcnkiLCJsYXN0TmFtZSI6IlRlc3QiLCJ1c2VyVHlwZSI6ImFkbWluaXN0cmF0b3IiLCJpYXQiOjE2MzY1NDYwNTYsImV4cCI6MTYzNjYzMjQ1Nn0.TgEksu1WHf_wMWS1X_Bkej3Q3__apyR7hLQLWfa6ADY").send({labId:'1'}).then((res)=>{
            expect(res.status).toBe(200)
        });
    });
});

describe("/viewAssignedTO",()=>{
    beforeEach(async()=>{
        server=require("../../app");
        let database=new Database();
        await database.insert('laboratory',null,['1','Lab1','1',3,true]);
        await database.insert("technical_officer",null,["100001","f","f","a@xy.com","sffsf","0777123456",true]);
        await database.insert('assigned_t_o',null,["100001","1"]);
    })
    afterEach(async()=>{
        server.close();
        let database=new Database();
        await database.clear('laboratory');
        await database.clear("assigned_t_o");
        await database.delete("technical_officer",["user_id","=","100001"]);
    });

    it("Should show details",async ()=>{
        await request(server).get("/admin/viewAssignedTO").set('Accept','application/json').set("Cookie","auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMDAwMCIsImVtYWlsIjoiaW52ZW50b3J5bWluZEBnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJJbnZlbnRvcnkiLCJsYXN0TmFtZSI6IlRlc3QiLCJ1c2VyVHlwZSI6ImFkbWluaXN0cmF0b3IiLCJpYXQiOjE2MzY1NDYwNTYsImV4cCI6MTYzNjYzMjQ1Nn0.TgEksu1WHf_wMWS1X_Bkej3Q3__apyR7hLQLWfa6ADY").then((res)=>{
            expect(res.status).toBe(200);
            expect(res.body.data).toBeTruthy();
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
        await request(server).get("/admin/getUserDetails").set('Accept','application/json').set("Cookie","auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMDAwMCIsImVtYWlsIjoiaW52ZW50b3J5bWluZEBnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJJbnZlbnRvcnkiLCJsYXN0TmFtZSI6IlRlc3QiLCJ1c2VyVHlwZSI6ImFkbWluaXN0cmF0b3IiLCJpYXQiOjE2MzY1NDYwNTYsImV4cCI6MTYzNjYzMjQ1Nn0.TgEksu1WHf_wMWS1X_Bkej3Q3__apyR7hLQLWfa6ADY").then((res)=>{
            expect(res.status).toBe(200);
            expect(res.body.title).toBe("Success");
        });
    });
});

describe("/viewLab",()=>{
    beforeEach(async()=>{
        server=require("../../app");
        let database=new Database();
        await database.insert('laboratory',null,['1','Lab1','1',3,true]);
        await database.insert("technical_officer",null,["100001","f","f","a@xy.com","sffsf","0777123456",true]);
        await database.insert('assigned_t_o',null,["100001","1"]);
    })
    afterEach(async()=>{
        server.close();
        let database=new Database();
        await database.clear('laboratory');
        await database.clear("assigned_t_o");
        await database.delete("technical_officer",["user_id","=","100001"]);
    });

    it("Should show details",async ()=>{
        await request(server).get("/admin/viewLab").set('Accept','application/json').set("Cookie","auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMDAwMCIsImVtYWlsIjoiaW52ZW50b3J5bWluZEBnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJJbnZlbnRvcnkiLCJsYXN0TmFtZSI6IlRlc3QiLCJ1c2VyVHlwZSI6ImFkbWluaXN0cmF0b3IiLCJpYXQiOjE2MzY1NDYwNTYsImV4cCI6MTYzNjYzMjQ1Nn0.TgEksu1WHf_wMWS1X_Bkej3Q3__apyR7hLQLWfa6ADY").then((res)=>{
            expect(res.status).toBe(200);
            expect(res.body.title).toBe("Success");
        });
    });
});

describe("/viewUsers/student",()=>{
    beforeEach(async()=>{
        server=require("../../app");
        let database=new Database();
        await database.insert("student",null,["100001","f","f","a@xy.com","sffsf","0777123456",true]);
    })
    afterEach(async()=>{
        server.close();
        let database=new Database();
        await database.delete("student",["user_id","=","100001"]);
    });

    it("Should show details",async ()=>{
        await request(server).get("/admin/viewUsers/student").set('Accept','application/json').set("Cookie","auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMDAwMCIsImVtYWlsIjoiaW52ZW50b3J5bWluZEBnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJJbnZlbnRvcnkiLCJsYXN0TmFtZSI6IlRlc3QiLCJ1c2VyVHlwZSI6ImFkbWluaXN0cmF0b3IiLCJpYXQiOjE2MzY1NDYwNTYsImV4cCI6MTYzNjYzMjQ1Nn0.TgEksu1WHf_wMWS1X_Bkej3Q3__apyR7hLQLWfa6ADY").then((res)=>{
            expect(res.status).toBe(200);
            expect(res.body.msg.some(i=>i.user_id=="100001")).toBeTruthy();
        });
    });
});

describe("/viewUsers/lecturer",()=>{
    beforeEach(async()=>{
        server=require("../../app");
        let database=new Database();
        await database.insert("lecturer",null,["100001","f","f","a@xy.com","sffsf","0777123456",true]);
    })
    afterEach(async()=>{
        server.close();
        let database=new Database();
        await database.delete("lecturer",["user_id","=","100001"]);
    });

    it("Should show details",async ()=>{
        await request(server).get("/admin/viewUsers/lecturer").set('Accept','application/json').set("Cookie","auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMDAwMCIsImVtYWlsIjoiaW52ZW50b3J5bWluZEBnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJJbnZlbnRvcnkiLCJsYXN0TmFtZSI6IlRlc3QiLCJ1c2VyVHlwZSI6ImFkbWluaXN0cmF0b3IiLCJpYXQiOjE2MzY1NDYwNTYsImV4cCI6MTYzNjYzMjQ1Nn0.TgEksu1WHf_wMWS1X_Bkej3Q3__apyR7hLQLWfa6ADY").then((res)=>{
            expect(res.status).toBe(200);
            expect(res.body.msg.some(i=>i.user_id=="100001")).toBeTruthy();
        });
    });
});

describe("/viewUsers/technical_officer",()=>{
    beforeEach(async()=>{
        server=require("../../app");
        let database=new Database();
        await database.insert("technical_officer",null,["100001","f","f","a@xy.com","sffsf","0777123456",true]);
    })
    afterEach(async()=>{
        server.close();
        let database=new Database();
        await database.delete("technical_officer",["user_id","=","100001"]);
    });

    it("Should show details",async ()=>{
        await request(server).get("/admin/viewUsers/technical_officer").set('Accept','application/json').set("Cookie","auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMDAwMCIsImVtYWlsIjoiaW52ZW50b3J5bWluZEBnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJJbnZlbnRvcnkiLCJsYXN0TmFtZSI6IlRlc3QiLCJ1c2VyVHlwZSI6ImFkbWluaXN0cmF0b3IiLCJpYXQiOjE2MzY1NDYwNTYsImV4cCI6MTYzNjYzMjQ1Nn0.TgEksu1WHf_wMWS1X_Bkej3Q3__apyR7hLQLWfa6ADY").then((res)=>{
            expect(res.status).toBe(200);
            expect(res.body.msg.some(i=>i.user_id=="100001")).toBeTruthy();
        });
    });
});

describe("/getBuildings",()=>{
    beforeEach(async()=>{
        server=require("../../app");
        let database=new Database();
        await database.insert("building",null,["2","test1"]);
    })
    afterEach(async()=>{
        server.close();
        let database=new Database();
        await database.delete("building",["b_id","=","2"]);
    });

    it("Should show buildings",async ()=>{
        await request(server).get("/admin/getBuildings").set('Accept','application/json').set("Cookie","auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMDAwMCIsImVtYWlsIjoiaW52ZW50b3J5bWluZEBnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJJbnZlbnRvcnkiLCJsYXN0TmFtZSI6IlRlc3QiLCJ1c2VyVHlwZSI6ImFkbWluaXN0cmF0b3IiLCJpYXQiOjE2MzY1NDYwNTYsImV4cCI6MTYzNjYzMjQ1Nn0.TgEksu1WHf_wMWS1X_Bkej3Q3__apyR7hLQLWfa6ADY").then((res)=>{
            expect(res.status).toBe(200);
            expect(res.body.msg.some(i=>i.b_id=="2")).toBeTruthy();
        });
    });
});

describe("/getLabs",()=>{
    beforeEach(async()=>{
        server=require("../../app");
        let database=new Database();
        await database.insert('laboratory',null,['1','Lab1','1',3,true]);    })
    afterEach(async()=>{
        server.close();
        let database=new Database();
        await database.delete("laboratory",["lab_id","=","1"]);
    });

    it("Should show details",async ()=>{
        await request(server).get("/admin/getLabs").set('Accept','application/json').set("Cookie","auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMDAwMCIsImVtYWlsIjoiaW52ZW50b3J5bWluZEBnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJJbnZlbnRvcnkiLCJsYXN0TmFtZSI6IlRlc3QiLCJ1c2VyVHlwZSI6ImFkbWluaXN0cmF0b3IiLCJpYXQiOjE2MzY1NDYwNTYsImV4cCI6MTYzNjYzMjQ1Nn0.TgEksu1WHf_wMWS1X_Bkej3Q3__apyR7hLQLWfa6ADY").then((res)=>{
            expect(res.status).toBe(200);
            expect(res.body.msg.some(i=>i.lab_id=="1")).toBeTruthy();
        });
    });
});

describe("/getTOs",()=>{
    beforeEach(async()=>{
        server=require("../../app");
        let database=new Database();
        await database.insert("technical_officer",null,["100001","f","f","a@xy.com","sffsf","0777123456",true]);     })
    afterEach(async()=>{
        server.close();
        let database=new Database();
        await database.delete("technical_officer",["user_id","=","100001"]);
    });

    it("Should show details",async ()=>{
        await request(server).get("/admin/getTOs").set('Accept','application/json').set("Cookie","auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMDAwMCIsImVtYWlsIjoiaW52ZW50b3J5bWluZEBnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJJbnZlbnRvcnkiLCJsYXN0TmFtZSI6IlRlc3QiLCJ1c2VyVHlwZSI6ImFkbWluaXN0cmF0b3IiLCJpYXQiOjE2MzY1NDYwNTYsImV4cCI6MTYzNjYzMjQ1Nn0.TgEksu1WHf_wMWS1X_Bkej3Q3__apyR7hLQLWfa6ADY").then((res)=>{
            expect(res.status).toBe(200);
            expect(res.body.msg.some(i=>i.user_id=="100001")).toBeTruthy();
        });
    });
});

describe("/addEquipType",()=>{
    beforeEach(async()=>{
        server=require("../../app");
    });

    afterEach(async()=>{
        server.close();
        let database=new Database();
        await database.clear("equipment_type");
    });

    it("Should add equip type",async ()=>{
        await request(server).post("/admin/addEquipType").set('Accept','application/json').set("Cookie","auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMDAwMCIsImVtYWlsIjoiaW52ZW50b3J5bWluZEBnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJJbnZlbnRvcnkiLCJsYXN0TmFtZSI6IlRlc3QiLCJ1c2VyVHlwZSI6ImFkbWluaXN0cmF0b3IiLCJpYXQiOjE2MzY1NDYwNTYsImV4cCI6MTYzNjYzMjQ1Nn0.TgEksu1WHf_wMWS1X_Bkej3Q3__apyR7hLQLWfa6ADY").send({type:"a",brand:"b"}).then((res)=>{
            expect(res.status).toBe(200);
        });
    });

    it("Should not add equip type",async ()=>{
        await request(server).post("/admin/addEquipType").set('Accept','application/json').set("Cookie","auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMDAwMCIsImVtYWlsIjoiaW52ZW50b3J5bWluZEBnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJJbnZlbnRvcnkiLCJsYXN0TmFtZSI6IlRlc3QiLCJ1c2VyVHlwZSI6ImFkbWluaXN0cmF0b3IiLCJpYXQiOjE2MzY1NDYwNTYsImV4cCI6MTYzNjYzMjQ1Nn0.TgEksu1WHf_wMWS1X_Bkej3Q3__apyR7hLQLWfa6ADY").send({brand:"b"}).then((res)=>{
            expect(res.status).toBe(400);
        });
    });
});


describe("/getDashboardData",()=>{
    beforeEach(async()=>{
        server=require("../../app");
    })

    afterEach(async()=>{
        server.close();
    });

    it("Should show data",async ()=>{
        await request(server).get("/admin/getDashboardData").set('Accept','application/json').set("Cookie","auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMDAwMCIsImVtYWlsIjoiaW52ZW50b3J5bWluZEBnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJJbnZlbnRvcnkiLCJsYXN0TmFtZSI6IlRlc3QiLCJ1c2VyVHlwZSI6ImFkbWluaXN0cmF0b3IiLCJpYXQiOjE2MzY1NDYwNTYsImV4cCI6MTYzNjYzMjQ1Nn0.TgEksu1WHf_wMWS1X_Bkej3Q3__apyR7hLQLWfa6ADY").then((res)=>{
            expect(res.status).toBe(200);
            expect(res.body.title).toBe("Success");
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
        await database.delete("laboratory",["lab_id","=","1"]);
        await database.clear("requested_equipments");
        await database.clear("equipment");
        await database.clear("request");
        await database.clear("equipment_type");
        await database.delete("lecturer",["user_id","=","100001"]);
        await database.delete("student",["user_id","=","100001"]);

    });

    it("Should show stats",async ()=>{
        await request(server).get("/admin/getRequestStats").set('Accept','application/json').set("Cookie","auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMDAwMCIsImVtYWlsIjoiaW52ZW50b3J5bWluZEBnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJJbnZlbnRvcnkiLCJsYXN0TmFtZSI6IlRlc3QiLCJ1c2VyVHlwZSI6ImFkbWluaXN0cmF0b3IiLCJpYXQiOjE2MzY1NDYwNTYsImV4cCI6MTYzNjYzMjQ1Nn0.TgEksu1WHf_wMWS1X_Bkej3Q3__apyR7hLQLWfa6ADY").then((res)=>{
            expect(res.status).toBe(200);
            expect(res.body.msg.pending).toBe(1);
            expect(res.body.msg.accepted).toBe(1);
            expect(res.body.msg.rejected).toBe(1);
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
        await request(server).get("/admin/getUserStats").set('Accept','application/json').set("Cookie","auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMDAwMCIsImVtYWlsIjoiaW52ZW50b3J5bWluZEBnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJJbnZlbnRvcnkiLCJsYXN0TmFtZSI6IlRlc3QiLCJ1c2VyVHlwZSI6ImFkbWluaXN0cmF0b3IiLCJpYXQiOjE2MzY1NDYwNTYsImV4cCI6MTYzNjYzMjQ1Nn0.TgEksu1WHf_wMWS1X_Bkej3Q3__apyR7hLQLWfa6ADY").then((res)=>{
            expect(res.status).toBe(200);
            expect(res.body.msg.lecturer).toBe("1");
            expect(res.body.msg.student).toBe("1");
            expect(res.body.msg.technicalOfficer).toBe("1");
        });
    });
});

describe("/getEquipStats",()=>{
    beforeEach(async()=>{
        let database=new Database();
        await database.insert("equipment_type",null,["1","a","a"]);
        await database.insert("equipment",null,["1","1","a","1","10/11/2021",0,"a"]);
        await database.insert("equipment",null,["2","1","a","1","10/11/2021",1,"a"]);
        await database.insert("equipment",null,["3","1","a","1","10/11/2021",2,"a"]);
        await database.insert("equipment",null,["4","1","a","1","10/11/2021",3,"a"]);
        await database.insert("equipment",null,["5","1","a","1","10/11/2021",4,"a"]);
        await database.insert("equipment",null,["6","1","a","1","10/11/2021",5,"a"]);

        server=require("../../app");
    })

    afterEach(async()=>{
        server.close();
        let database=new Database();
        await database.clear("equipment");
        await database.clear("equipment_type");
    });

    it("Should show stats",async ()=>{
        await request(server).get("/admin/getEquipStats").set('Accept','application/json').set("Cookie","auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMDAwMCIsImVtYWlsIjoiaW52ZW50b3J5bWluZEBnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJJbnZlbnRvcnkiLCJsYXN0TmFtZSI6IlRlc3QiLCJ1c2VyVHlwZSI6ImFkbWluaXN0cmF0b3IiLCJpYXQiOjE2MzY1NDYwNTYsImV4cCI6MTYzNjYzMjQ1Nn0.TgEksu1WHf_wMWS1X_Bkej3Q3__apyR7hLQLWfa6ADY").then((res)=>{
            expect(res.status).toBe(200);
            expect(res.body.msg.every(i=>i.count=="1")).toBeTruthy();
        });
    });
});