const ject=require('jest');
const Database=require('../../database/database');
const User=require("../../models/User");

jest.mock('../../database/database');
jest.mock('../../utils/email');
beforeEach(()=>{
    Database.mockClear();
});

describe("login", ()=>{
    it ("Should return validation error",async ()=>{
        // Database.mockRestore();
        Object.defineProperty(Database, 'connectionError', {
            configurable: true,
            get: jest.fn(() => {return Promise.resolve(false)}),
            set: jest.fn()
        });
        // Database.connectionError=false;
        const result=await new User({email:"st@xyz.com",userType:"admin"}).login();
        expect(result).toHaveProperty("validationError");
    });

    it ("Should return validation error",async ()=>{
        const result=await new User({email:"st@xyz.com",userType:"admin"}).login("");

        expect(result).toHaveProperty("validationError");
    });

    it ("Should return failure",async()=>{
        Database.mockImplementation(()=>{
            return {
                readSingleTable:()=>{
                    return Promise.resolve({error:false,result:{rows:[{password:"$2b$10$K3eDsEnie5DkDvjpRjkPVulr.uDXmux8.pY1ZyriyI7OHHK/GlSEC"}],rowCount:1}})
                }
            }
        });

        const result=await new User({email:"st@xyz.com",userType:"admin"}).login("admi");
        expect(result).toHaveProperty("allowedAccess",false)
    });

    it ("Should return success",async()=>{
        Database.mockImplementation(()=>{
            return {
                readSingleTable:()=>{
                    return Promise.resolve({error:false,result:{rows:[{password:"$2b$10$K3eDsEnie5DkDvjpRjkPVulr.uDXmux8.pY1ZyriyI7OHHK/GlSEC"}],rowCount:1}})
                }
            }
        });

        const result=await new User({email:"st@xyz.com",userType:"admin"}).login("admin");
        expect(result).toHaveProperty("allowedAccess",true)
    });
});

describe("forgot password", ()=>{
    it ("Should return failure",async()=>{
        Object.defineProperty(Database, 'connectionError', {
            configurable: true,
            get: jest.fn(() => {return Promise.resolve(false)}),
            set: jest.fn()
        });
        Database.mockImplementation(()=>{
            return {
                readSingleTable:()=>{
                    return Promise.resolve({error:true})
                },
                insert:()=>{
                    return Promise.resolve({error:true})
                }
            }
        });

        const result=await new User({email:"st@xyz.com",userType:"admin"}).forgotPassword();
        expect(result).toHaveProperty("action",false)
    });

    it ("Should return failure",async()=>{
        Database.mockImplementation(()=>{
            return {
                readSingleTable:()=>{
                    return Promise.resolve({error:false,result:{rows:[],rowCount:0}})
                },
                insert:()=>{
                    return Promise.resolve({error:true})
                }
            }
        });

        const result=await new User({email:"st@xyz.com",userType:"admin"}).forgotPassword();
        expect(result).toHaveProperty("noAcc",true)
    });

    it ("Should return failure",async()=>{
        Database.mockImplementation(()=>{
            return {
                readSingleTable:()=>{
                    return Promise.resolve({error:false,result:{rows:[{}],rowCount:1}})
                },
                insert:()=>{
                    return Promise.resolve({error:true})
                }
            }
        });

        const result=await new User({email:"st@xyz.com",userType:"admin"}).forgotPassword();
        expect(result).toHaveProperty("action",false)
    });

    it ("Should return success",async()=>{
        Database.mockImplementation(()=>{
            return {
                readSingleTable:()=>{
                    return Promise.resolve({error:false,result:{rows:[{}],rowCount:1}})
                },
                insert:()=>{
                    return Promise.resolve({error:false})
                }
            }
        });

        const result=await new User({email:"st@xyz.com",userType:"admin"}).forgotPassword();
        expect(result).toHaveProperty("action",true)
    });

});

describe("get user details", ()=>{
    it ("Should return failure",async()=>{
        Object.defineProperty(Database, 'connectionError', {
            configurable: true,
            get: jest.fn(() => {return Promise.resolve(false)}),
            set: jest.fn()
        });
        Database.mockImplementation(()=>{
            return {
                readSingleTable:()=>{
                    return Promise.resolve({error:true})
                }
            }
        });

        const result=await new User({email:"st@xyz.com",userType:"admin"}).getUserDetails();
        expect(result).toHaveProperty("action",false)
    });

    it ("Should return success",async()=>{
        Database.mockImplementation(()=>{
            return {
                readSingleTable:()=>{
                    return Promise.resolve({error:false,result:{rows:[{}],rowCount:1}})
                }
            }
        });

        const result=await new User({email:"st@xyz.com",userType:"admin"}).getUserDetails();
        expect(result).toHaveProperty("action",true)
    });

});


