const Database=require('../database/database');
const Admin =require ('../models/Admin');
// const admin = new Admin({email:"st@xyz.com",userType:"administrator"});

jest.mock('../database/database');
beforeEach(()=>{
    Database.mockClear();
});

describe("addLaboratory", ()=>{
    // it ("Should return database error",async ()=>{
        
    //     Object.defineProperty(Database, 'connectionError', {
    //         configurable:true,
    //         get: jest.fn(() => {return Promise.resolve(true)}),
    //         set: jest.fn()
    //       });

    //     const result=await new Admin({email:"st@xyz.com",userType:"administrator"}).addLaboratory("1","a","3","1");

    //     expect(result).toMatchObject({"connectionError":true});
    // });

    it ("Should return validation error",async ()=>{
        // Database.mockRestore();
        Object.defineProperty(Database, 'connectionError', {
            configurable: true,
            get: jest.fn(() => {return Promise.resolve(false)}),
            set: jest.fn()
        });
        // Database.connectionError=false;
        const result=await new Admin({email:"st@xyz.com",userType:"administrator"}).addLaboratory();
        expect(result).toHaveProperty("validationError");
    });

    it ("Should return validation error",async ()=>{
        const result=await new Admin({email:"st@xyz.com",userType:"administrator"}).addLaboratory("","","","");

        expect(result).toHaveProperty("validationError");
    });

    it ("Should return validation error",async ()=>{
        const result=await new Admin({email:"st@xyz.com",userType:"administrator"}).addLaboratory(null,null,null,null);

        expect(result).toHaveProperty("validationError");
    });

    it ("Should return validation error",async ()=>{
        const result=await new Admin({email:"st@xyz.com",userType:"administrator"}).addLaboratory(undefined,undefined,undefined,undefined);

        expect(result).toHaveProperty("validationError");
    });

    it ("Should return failure",async()=>{
        Database.mockImplementation(()=>{
            return {
                insert:()=>{return Promise.resolve({error:true})}
            }
        });

        const result=await new Admin({email:"st@xyz.com",userType:"administrator"}).addLaboratory("1","a","4","2");
        expect(result).toHaveProperty("action",false)
    });

    it ("Should return success",async()=>{
        Database.mockImplementation(()=>{
            return {
                insert:()=>{return Promise.resolve({error:false})}
            }
        });

        const result=await new Admin({email:"st@xyz.com",userType:"administrator"}).addLaboratory("1","a","4","2");
        expect(result).toHaveProperty("action",true)
    });
});

describe("removeLaboratory",()=>{
    it("Should return validation error",async ()=>{
        const result=await new Admin({email:"st@xyz.com",userType:"administrator"}).removeLaboratory("a1");
        expect(result).toHaveProperty("validationError");
    });

    it("Should return validation error - null",async ()=>{
        const result=await new Admin({email:"st@xyz.com",userType:"administrator"}).removeLaboratory(null);
        expect(result).toHaveProperty("validationError");
    });

    it("Should return validation error - undefined",async ()=>{
        const result=await new Admin({email:"st@xyz.com",userType:"administrator"}).removeLaboratory(undefined);
        expect(result).toHaveProperty("validationError");
    });

    it("Should return failed",async ()=>{
        Database.mockImplementation(()=>{
            return {
                update:()=>{return Promise.resolve({error:true})}
            }
        });
        const result=await new Admin({email:"st@xyz.com",userType:"administrator"}).removeLaboratory("1");
        expect(result).toHaveProperty("action",false);
    });

    it("Should return success",async ()=>{
        Database.mockImplementation(()=>{
            return {
                update:()=>{return Promise.resolve({error:false})}
            }
        });
        const result=await new Admin({email:"st@xyz.com",userType:"administrator"}).removeLaboratory("1");
        expect(result).toHaveProperty("action",true);
    });
});