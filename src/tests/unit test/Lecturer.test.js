const Database=require('../../database/database');
const Lecturer = require('../../models/Lecturer');

jest.mock('../../database/database');
beforeEach(()=>{
    Database.mockClear();
});

describe("Approve Request",()=>{
    it("Should return validation error",async ()=>{
        const result=await new Lecturer({email:"st@xyz.com",userType:"lecturer"}).approve("a1");
        expect(result).toHaveProperty("validationError");
    });

    it("Should return validation error - null",async ()=>{
        const result=await new Lecturer({email:"st@xyz.com",userType:"lecturer"}).approve(null);
        expect(result).toHaveProperty("validationError");
    });

    it("Should return validation error - undefined",async ()=>{
        const result=await new Lecturer({email:"st@xyz.com",userType:"lecturer"}).approve(undefined);
        expect(result).toHaveProperty("validationError");
    });

    it("Should return failed",async ()=>{
        Database.mockImplementation(()=>{
            return {
                update:()=>{return Promise.resolve({error:true})}
            }
        });
        const result=await new Lecturer({email:"st@xyz.com",userType:"lecturer"}).approve("1");
        expect(result).toHaveProperty("action",false);
    });

    it("Should return failed",async ()=>{
        Database.mockImplementation(()=>{
            return {
                update:()=>{return Promise.resolve({error:false,result:{rowCount:0}})}
            }
        });
        const result=await new Lecturer({email:"st@xyz.com",userType:"lecturer"}).approve("1");
        expect(result).toHaveProperty("action",false);
    });

    it("Should return success",async ()=>{
        Database.mockImplementation(()=>{
            return {
                update:()=>{return Promise.resolve({error:false,result:{rowCount:1}})}
            }
        });
        const result=await new Lecturer({email:"st@xyz.com",userType:"lecturer"}).approve("1");
        expect(result).toHaveProperty("action",true);
    });
});

describe("Reject Request",()=>{
    it("Should return validation error",async ()=>{
        const result=await new Lecturer({email:"st@xyz.com",userType:"lecturer"}).reject("a1");
        expect(result).toHaveProperty("validationError");
    });

    it("Should return validation error - null",async ()=>{
        const result=await new Lecturer({email:"st@xyz.com",userType:"lecturer"}).reject(null);
        expect(result).toHaveProperty("validationError");
    });

    it("Should return validation error - undefined",async ()=>{
        const result=await new Lecturer({email:"st@xyz.com",userType:"lecturer"}).reject(undefined);
        expect(result).toHaveProperty("validationError");
    });

    it("Should return failed",async ()=>{
        Database.mockImplementation(()=>{
            return {
                update:()=>{return Promise.resolve({error:true})}
            }
        });
        const result=await new Lecturer({email:"st@xyz.com",userType:"lecturer"}).reject("1");
        expect(result).toHaveProperty("action",false);
    });

    it("Should return failed",async ()=>{
        Database.mockImplementation(()=>{
            return {
                update:()=>{return Promise.resolve({error:false,result:{rowCount:0}})}
            }
        });
        const result=await new Lecturer({email:"st@xyz.com",userType:"lecturer"}).reject("1");
        expect(result).toHaveProperty("action",false);
    });

    it("Should return success",async ()=>{
        Database.mockImplementation(()=>{
            return {
                update:()=>{return Promise.resolve({error:false,result:{rowCount:1}})}
            }
        });
        const result=await new Lecturer({email:"st@xyz.com",userType:"lecturer"}).reject("1");
        expect(result).toHaveProperty("action",true);
    });
});

describe("View All Request",()=>{
    it ("Should return failed",async ()=>{
     Database.mockImplementation(()=>{
         return{
             readSingleTable:()=>{
                 return Promise.resolve({error:true});
             }
         }
     });

     const result=await new Lecturer({email:"st@xyz.com",userType:"lecturer"}).viewAllRequests();

     expect(result).toHaveProperty("action",false);
 });

 it ("Should return success",async ()=>{
     Database.mockImplementation(()=>{
         return{
             readSingleTable:()=>{
                 return Promise.resolve({error:false,result:{rows:[{request_id:0,date_of_borrowing:'22/11/2021',student_id:'1',state:0}]}});
             }
         }
     });

     const result=await new Lecturer({email:"st@xyz.com",userType:"lecturer"}).viewAllRequests();

     expect(result).toHaveProperty("action",true);
 });
});

describe("View Accepted Request",()=>{
    it ("Should return failed",async ()=>{
     Database.mockImplementation(()=>{
         return{
             readSingleTable:()=>{
                 return Promise.resolve({error:true});
             }
         }
     });

     const result=await new Lecturer({email:"st@xyz.com",userType:"lecturer"}).viewAcceptedRequest();

     expect(result).toHaveProperty("action",false);
 });

 it ("Should return success",async ()=>{
     Database.mockImplementation(()=>{
         return{
             readSingleTable:()=>{
                 return Promise.resolve({error:false,result:{rows:[{request_id:0,date_of_borrowing:'22/11/2021',student_id:'1',state:0}]}});
             }
         }
     });

     const result=await new Lecturer({email:"st@xyz.com",userType:"lecturer"}).viewAcceptedRequest();

     expect(result).toHaveProperty("action",true);
 });
});

describe("View Rejected Request",()=>{
    it ("Should return failed",async ()=>{
     Database.mockImplementation(()=>{
         return{
             readSingleTable:()=>{
                 return Promise.resolve({error:true});
             }
         }
     });

     const result=await new Lecturer({email:"st@xyz.com",userType:"lecturer"}).viewRejectedRequest();

     expect(result).toHaveProperty("action",false);
 });

 it ("Should return success",async ()=>{
     Database.mockImplementation(()=>{
         return{
             readSingleTable:()=>{
                 return Promise.resolve({error:false,result:{rows:[{request_id:0,date_of_borrowing:new Date(),student_id:'1',state:0}]}});
             }
         }
     });

     const result=await new Lecturer({email:"st@xyz.com",userType:"lecturer"}).viewRejectedRequest();

     expect(result).toHaveProperty("action",true);
 });
});

describe("View Pending Request",()=>{
    it ("Should return failed",async ()=>{
     Database.mockImplementation(()=>{
         return{
             readSingleTable:()=>{
                 return Promise.resolve({error:true});
             }
         }
     });

     const result=await new Lecturer({email:"st@xyz.com",userType:"lecturer"}).viewPendingRequests();

     expect(result).toHaveProperty("action",false);
 });

 it ("Should return success",async ()=>{
     Database.mockImplementation(()=>{
         return{
             readSingleTable:()=>{
                 return Promise.resolve({error:false,result:{rows:[{request_id:0,date_of_borrowing:new Date(),student_id:'1',state:0}]}});
             }
         }
     });

     const result=await new Lecturer({email:"st@xyz.com",userType:"lecturer"}).viewPendingRequests();

     expect(result).toHaveProperty("action",true);
 });
});

describe("View Request Detail",()=>{
    it ("Should return failed",async ()=>{
     Database.mockImplementation(()=>{
         return{
             viewRequest:()=>{
                 return Promise.resolve({error:true});
             },
             readSingleTable:()=>{
                 return Promise.resolve({error:true})
             }
         }
     });

     const result=await new Lecturer({email:"st@xyz.com",userType:"lecturer"}).viewRequest(1);

     expect(result).toHaveProperty("action",false);
 });

 it ("Should return failed",async ()=>{
     Database.mockImplementation(()=>{
         return{
             viewRequest:(reqId)=>{
                 return Promise.resolve({error:false,result:{rows:[{request_id:reqId,date_of_borrowing:new Date(),date_of_returning:new Date(),student_id:'1',type_id:0,type:"a",brand:"a",eq_id:1,state:0}]}});
             },
             readSingleTable:()=>{
                 return Promise.resolve({error:true})
             }
         }
     });

     const result=await new Lecturer({email:"st@xyz.com",userType:"lecturer"}).viewRequest(1);

     expect(result).toHaveProperty("action",false);
 });

 it ("Should return success",async ()=>{
    Database.mockImplementation(()=>{
        return{
            viewRequest:(reqId)=>{
                return Promise.resolve({error:false,result:{rows:[{request_id:reqId,date_of_borrowing:new Date(),date_of_returning:new Date(),student_id:'1',type_id:0,type:"a",brand:"a",eq_id:1,state:0}]}});
            },
            readSingleTable:()=>{
                return Promise.resolve({error:false,result:{rows:[{first_name:"a",last_name:"b"}]}})
            }
        }
    });

    const result=await new Lecturer({email:"st@xyz.com",userType:"lecturer"}).viewRequest(1);

    expect(result).toHaveProperty("action",true);
});

});


describe("getDashboardData",()=>{
    it ("Should return failed",async ()=>{
     Database.mockImplementation(()=>{
         return{
             getCount:()=>{
                 return Promise.resolve({error:true});
             }
         }
     });

     const result=await new Lecturer({email:"st@xyz.com",userType:"administrator"}).getDashboardDataMob();

     expect(result).toHaveProperty("action",false);
 });

 it ("Should return success",async ()=>{
     Database.mockImplementation(()=>{
         return{
             getCount:()=>{
                 return Promise.resolve({error:false,result:{rows:[1]}});
             }
         }
     });

     const result=await new Lecturer({email:"st@xyz.com",userType:"administrator"}).getDashboardDataMob();

     expect(result).toHaveProperty("action",true);
 });
});