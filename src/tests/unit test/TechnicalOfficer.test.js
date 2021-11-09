const Database=require('../../database/database');
const TechnicalOfficer =require ('../../models/TechnicalOffcier');
// const TechnicalOfficer = new Admin({email:"st@xyz.com",userType:"technicalOfficeristrator"});

jest.mock('../../database/database');
beforeEach(()=>{
    Database.mockClear();
});

describe("addEquipment", ()=>{
    // it ("Should return database error",async ()=>{
        
    //     Object.defineProperty(Database, 'connectionError', {
    //         configurable:true,
    //         get: jest.fn(() => {return Promise.resolve(true)}),
    //         set: jest.fn()
    //       });

    //     const result=await new TechnicalOfficer({email:"st@xyz.com",userType:"TechnicalOfficeristrator"}).addLaboratory("1","a","3","1");

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
        const result=await new TechnicalOfficer({email:"st@xyz.com",userType:"TechnicalOfficer"}).addEquipment();
        expect(result).toHaveProperty("validationError");
    });

    it ("Should return validation error",async ()=>{
        const result=await new TechnicalOfficer({email:"st@xyz.com",userType:"TechnicalOfficeristrator"}).addEquipment("","");

        expect(result).toHaveProperty("validationError");
    });

    it ("Should return validation error",async ()=>{
        const result=await new TechnicalOfficer({email:"st@xyz.com",userType:"TechnicalOfficeristrator"}).addEquipment(null,null);

        expect(result).toHaveProperty("validationError");
    });

    it ("Should return failure",async()=>{
        Database.mockImplementation(()=>{
            return {
                insert:()=>{return Promise.resolve({error:true})},
                readTwoTable:()=>{
                    return Promise.resolve({error:false,result:{rows:[{}],rowCount:1}})
                },
                readMax:()=>{
                    return Promise.resolve({error:true})
                }
            }
        });

        const result=await new TechnicalOfficer({email:"st@xyz.com",userType:"TechnicalOfficeristrator"}).addEquipment("1","4");
        expect(result).toHaveProperty("action",false)
    });

    it ("Should return failure",async()=>{
        Database.mockImplementation(()=>{
            return {
                insert:()=>{return Promise.resolve({error:true})},
                readTwoTable:()=>{
                    return Promise.resolve({error:false,result:{rows:[{}],rowCount:1}})
                },
                readMax:()=>{
                    return Promise.resolve({error:false,result:{rows:[{}],rowCount:1}})
                }
            }
        });

        const result=await new TechnicalOfficer({email:"st@xyz.com",userType:"TechnicalOfficeristrator"}).addEquipment("1","4");
        expect(result).toHaveProperty("action",false)
    });

    it ("Should return failure",async()=>{
        Database.mockImplementation(()=>{
            return {
                insert:()=>{return Promise.resolve({error:false})},
                readTwoTable:()=>{
                    return Promise.resolve({error:true})
                },
                readMax:()=>{
                    return Promise.resolve({error:false,result:{rows:[{max:1}],rowCount:1}})
                }
            }
        });

        const result=await new TechnicalOfficer({email:"st@xyz.com",userType:"TechnicalOfficeristrator"}).addEquipment("1","4");
        expect(result).toHaveProperty("action",false)
    });

    it ("Should return success",async()=>{
        Database.mockImplementation(()=>{
            return {
                insert:()=>{return Promise.resolve({error:false})},
                readTwoTable:()=>{
                    return Promise.resolve({error:false,result:{rows:[{}],rowCount:1}})
                },
                readMax:()=>{
                    return Promise.resolve({error:false,result:{rows:[{}],rowCount:1}})
                }
            }
        });

        const result=await new TechnicalOfficer({email:"st@xyz.com",userType:"TechnicalOfficeristrator"}).addEquipment("1","4");
        expect(result).toHaveProperty("action",true)
    });
});

describe("removeLaboratory",()=>{
    it("Should return validation error",async ()=>{
        const result=await new TechnicalOfficer({email:"st@xyz.com",userType:"TechnicalOfficeristrator"}).removeEquipment();
        expect(result).toHaveProperty("validationError");
    });

    it("Should return validation error - null",async ()=>{
        const result=await new TechnicalOfficer({email:"st@xyz.com",userType:"TechnicalOfficeristrator"}).removeEquipment(null);
        expect(result).toHaveProperty("validationError");
    });

    it("Should return failed",async ()=>{
        Database.mockImplementation(()=>{
            return {
                update:()=>{return Promise.resolve({error:true})},
                readSingleTable:()=>{
                    return Promise.resolve({error:true})
                }
            }
        });
        const result=await new TechnicalOfficer({email:"st@xyz.com",userType:"TechnicalOfficeristrator"}).removeEquipment("1");
        expect(result).toHaveProperty("action",false);
    });

    it("Should return failed",async ()=>{
        Database.mockImplementation(()=>{
            return {
                update:()=>{return Promise.resolve({error:false})},
                readSingleTable:()=>{
                    return Promise.resolve({error:true})
                }
            }
        });
        const result=await new TechnicalOfficer({email:"st@xyz.com",userType:"TechnicalOfficeristrator"}).removeEquipment("1");
        expect(result).toHaveProperty("action",false);
    });

    it("Should return failed",async ()=>{
        Database.mockImplementation(()=>{
            return {
                update:()=>{return Promise.resolve({error:true})},
                readSingleTable:()=>{
                    return Promise.resolve({error:false,result:{rows:[{}]}})
                }
            }
        });
        const result=await new TechnicalOfficer({email:"st@xyz.com",userType:"TechnicalOfficeristrator"}).removeEquipment("1");
        expect(result).toHaveProperty("action",false);
    });

    it("Should return success",async ()=>{
        Database.mockImplementation(()=>{
            return {
                update:()=>{return Promise.resolve({error:false})},
                readSingleTable:()=>{
                    return Promise.resolve({error:false,result:{rows:[{}],rowCount:1}})
                }
            }
        });
        const result=await new TechnicalOfficer({email:"st@xyz.com",userType:"TechnicalOfficeristrator"}).removeEquipment("1");
        expect(result).toHaveProperty("action",true);
    });
});

describe("GetLabs", () => {
    it("Should return failed", async () => {
      Database.mockImplementation(() => {
        return {
          readSingleTable: () => {
            return Promise.resolve({ error: true });
          }
        };
      });
  
      const result = await new TechnicalOfficer({
        email: "st@xyz.com",
        userType: "student",
      }).getLabs();
  
      expect(result).toHaveProperty("action", false);
    });
  
    it("Should return failed", async () => {
      Database.mockImplementation(() => {
        return {
          readSingleTable: () => {
            return Promise.resolve({ error: true });
          }
        };
      });
  
      const result = await new TechnicalOfficer({
        email: "st@xyz.com",
        userType: "student",
      }).getLabs();
  
      expect(result).toHaveProperty("action", false);
    });
  
    it("Should return success", async () => {
      Database.mockImplementation(() => {
        return {
          readSingleTable: () => {
            return Promise.resolve({
              error: false,
              result: {
                rows: [
                  {},
                ],
              },
            });
          }
        };
      });
  
      const result = await new TechnicalOfficer({
        email: "st@xyz.com",
        userType: "student",
      }).getLabs();
  
      expect(result).toHaveProperty("action", true);
    });
  });

  describe("markAsNotUsable",()=>{
    it("Should return validation error",async ()=>{
        const result=await new TechnicalOfficer({email:"st@xyz.com",userType:"TechnicalOfficeristrator"}).markAsNotUsable();
        expect(result).toHaveProperty("validationError");
    });

    it("Should return validation error - null",async ()=>{
        const result=await new TechnicalOfficer({email:"st@xyz.com",userType:"TechnicalOfficeristrator"}).markAsNotUsable(null);
        expect(result).toHaveProperty("validationError");
    });

    it("Should return failed",async ()=>{
        Database.mockImplementation(()=>{
            return {
                update:()=>{return Promise.resolve({error:true})},
                readSingleTable:()=>{
                    return Promise.resolve({error:true})
                }
            }
        });
        const result=await new TechnicalOfficer({email:"st@xyz.com",userType:"TechnicalOfficeristrator"}).markAsNotUsable("1");
        expect(result).toHaveProperty("action",false);
    });

    it("Should return failed",async ()=>{
        Database.mockImplementation(()=>{
            return {
                update:()=>{return Promise.resolve({error:false})},
                readSingleTable:()=>{
                    return Promise.resolve({error:true})
                }
            }
        });
        const result=await new TechnicalOfficer({email:"st@xyz.com",userType:"TechnicalOfficeristrator"}).markAsNotUsable("1");
        expect(result).toHaveProperty("action",false);
    });

    it("Should return failed",async ()=>{
        Database.mockImplementation(()=>{
            return {
                update:()=>{return Promise.resolve({error:true})},
                readSingleTable:()=>{
                    return Promise.resolve({error:false,result:{rows:[{}]}})
                }
            }
        });
        const result=await new TechnicalOfficer({email:"st@xyz.com",userType:"TechnicalOfficeristrator"}).markAsNotUsable("1");
        expect(result).toHaveProperty("action",false);
    });

    it("Should return success",async ()=>{
        Database.mockImplementation(()=>{
            return {
                update:()=>{return Promise.resolve({error:false})},
                readSingleTable:()=>{
                    return Promise.resolve({error:false,result:{rows:[{}],rowCount:1}})
                }
            }
        });
        const result=await new TechnicalOfficer({email:"st@xyz.com",userType:"TechnicalOfficeristrator"}).markAsNotUsable("1");
        expect(result).toHaveProperty("action",true);
    });
});

describe("markAsAvailable",()=>{
    it("Should return validation error",async ()=>{
        const result=await new TechnicalOfficer({email:"st@xyz.com",userType:"TechnicalOfficeristrator"}).markAsAvailable();
        expect(result).toHaveProperty("validationError");
    });

    it("Should return validation error - null",async ()=>{
        const result=await new TechnicalOfficer({email:"st@xyz.com",userType:"TechnicalOfficeristrator"}).markAsAvailable(null);
        expect(result).toHaveProperty("validationError");
    });

    it("Should return failed",async ()=>{
        Database.mockImplementation(()=>{
            return {
                update:()=>{return Promise.resolve({error:true})},
                readSingleTable:()=>{
                    return Promise.resolve({error:true})
                }
            }
        });
        const result=await new TechnicalOfficer({email:"st@xyz.com",userType:"TechnicalOfficeristrator"}).markAsAvailable("1");
        expect(result).toHaveProperty("action",false);
    });

    it("Should return failed",async ()=>{
        Database.mockImplementation(()=>{
            return {
                update:()=>{return Promise.resolve({error:false})},
                readSingleTable:()=>{
                    return Promise.resolve({error:true})
                }
            }
        });
        const result=await new TechnicalOfficer({email:"st@xyz.com",userType:"TechnicalOfficeristrator"}).markAsAvailable("1");
        expect(result).toHaveProperty("action",false);
    });

    it("Should return failed",async ()=>{
        Database.mockImplementation(()=>{
            return {
                update:()=>{return Promise.resolve({error:true})},
                readSingleTable:()=>{
                    return Promise.resolve({error:false,result:{rows:[{}]}})
                }
            }
        });
        const result=await new TechnicalOfficer({email:"st@xyz.com",userType:"TechnicalOfficeristrator"}).markAsAvailable("1");
        expect(result).toHaveProperty("action",false);
    });

    it("Should return success",async ()=>{
        Database.mockImplementation(()=>{
            return {
                update:()=>{return Promise.resolve({error:false})},
                readSingleTable:()=>{
                    return Promise.resolve({error:false,result:{rows:[{}],rowCount:1}})
                }
            }
        });
        const result=await new TechnicalOfficer({email:"st@xyz.com",userType:"TechnicalOfficeristrator"}).markAsAvailable("1");
        expect(result).toHaveProperty("action",true);
    });
});

describe("Get Borrowed Details", () => {
    it("Should return failed", async () => {
        Database.mockImplementation(() => {
          return {
            readTwoTable: () => {
              return Promise.resolve({ error: true });
            }
          };
        });
    
        const result = await new TechnicalOfficer({
          email: "st@xyz.com",
          userType: "student",
        }).getBorrowDetails('1','temporary');
    
        expect(result).toHaveProperty("action", false);
      });

      it("Should return failed", async () => {
        Database.mockImplementation(() => {
          return {
            readThreeTableUsing: () => {
              return Promise.resolve({ error: true });
            }
          };
        });
    
        const result = await new TechnicalOfficer({
          email: "st@xyz.com",
          userType: "student",
        }).getBorrowDetails('1','normal');
    
        expect(result).toHaveProperty("action", false);
      });
  
    it("Should return success", async () => {
      Database.mockImplementation(() => {
        return {
          readThreeTableUsing:()=>{
              return Promise.resolve({error:false,result:{rows:[{}]}})
          }
        };
      });
  
      const result = await new TechnicalOfficer({
        email: "st@xyz.com",
        userType: "student",
      }).getBorrowDetails('1','normal');
  
      expect(result).toHaveProperty("action", true);
    });

    it("Should return success", async () => {
        Database.mockImplementation(() => {
          return {
            readTwoTable:()=>{
                return Promise.resolve({error:false,result:{rows:[{}]}})
            }
          };
        });
    
        const result = await new TechnicalOfficer({
          email: "st@xyz.com",
          userType: "student",
        }).getBorrowDetails('1','temporary');
    
        expect(result).toHaveProperty("action", true);
      });
  });

  describe("Accept Return", () => {
      it("Should return failed", async () => {
        Database.mockImplementation(() => {
          return {
            acceptReturns: () => {
              return Promise.resolve({ error: true });
            }
          };
        });
    
        const result = await new TechnicalOfficer({
          email: "st@xyz.com",
          userType: "student",
        }).acceptReturns('1','normal');
    
        expect(result).toHaveProperty("action", false);
      });

    it("Should return success", async () => {
        Database.mockImplementation(() => {
          return {
            acceptReturns:()=>{
                return Promise.resolve({error:false,result:{rows:[{}]}})
            }
          };
        });
    
        const result = await new TechnicalOfficer({
          email: "st@xyz.com",
          userType: "student",
        }).acceptReturns('1','temporary');
    
        expect(result).toHaveProperty("action", true);
      });
  });

  describe("Report Condition", () => {
    it("Should return failed", async () => {
      Database.mockImplementation(() => {
        return {
          update: () => {
            return Promise.resolve({ error: true });
          }
        };
      });
  
      const result = await new TechnicalOfficer({
        email: "st@xyz.com",
        userType: "student",
      }).reportCondition('1','G');
  
      expect(result).toHaveProperty("action", false);
    });

  it("Should return success", async () => {
      Database.mockImplementation(() => {
        return {
          update:()=>{
              return Promise.resolve({error:false,result:{rows:[{}]}})
          }
        };
      });
  
      const result = await new TechnicalOfficer({
        email: "st@xyz.com",
        userType: "student",
      }).reportCondition('1','G');
  
      expect(result).toHaveProperty("action", true);
    });
});

describe("transferEquipment",()=>{
    it("Should return validation error",async ()=>{
        const result=await new TechnicalOfficer({email:"st@xyz.com",userType:"TechnicalOfficeristrator"}).transferEquipment();
        expect(result).toHaveProperty("validationError");
    });

    it("Should return validation error - null",async ()=>{
        const result=await new TechnicalOfficer({email:"st@xyz.com",userType:"TechnicalOfficeristrator"}).transferEquipment(null,'1');
        expect(result).toHaveProperty("validationError");
    });

    it("Should return failed",async ()=>{
        Database.mockImplementation(()=>{
            return {
                update:()=>{return Promise.resolve({error:true})},
                readSingleTable:()=>{
                    return Promise.resolve({error:true})
                }
            }
        });
        const result=await new TechnicalOfficer({email:"st@xyz.com",userType:"TechnicalOfficeristrator"}).transferEquipment("1","1");
        expect(result).toHaveProperty("action",false);
    });

    it("Should return failed",async ()=>{
        Database.mockImplementation(()=>{
            return {
                update:()=>{return Promise.resolve({error:false})},
                readSingleTable:()=>{
                    return Promise.resolve({error:true})
                }
            }
        });
        const result=await new TechnicalOfficer({email:"st@xyz.com",userType:"TechnicalOfficeristrator"}).transferEquipment("1","1");
        expect(result).toHaveProperty("action",false);
    });

    it("Should return failed",async ()=>{
        Database.mockImplementation(()=>{
            return {
                update:()=>{return Promise.resolve({error:true})},
                readSingleTable:()=>{
                    return Promise.resolve({error:false,result:{rows:[{}]}})
                }
            }
        });
        const result=await new TechnicalOfficer({email:"st@xyz.com",userType:"TechnicalOfficeristrator"}).transferEquipment("1","1");
        expect(result).toHaveProperty("action",false);
    });

    it("Should return success",async ()=>{
        Database.mockImplementation(()=>{
            return {
                update:()=>{return Promise.resolve({error:false})},
                readSingleTable:()=>{
                    return Promise.resolve({error:false,result:{rows:[{}],rowCount:1}})
                }
            }
        });
        const result=await new TechnicalOfficer({email:"st@xyz.com",userType:"TechnicalOfficeristrator"}).transferEquipment("1","1");
        expect(result).toHaveProperty("action",true);
    });
});

describe("View Inventory", () => {
    it("Should return failed", async () => {
      Database.mockImplementation(() => {
        return {
          readThreeTable: () => {
            return Promise.resolve({ error: true });
          }
        };
      });
  
      const result = await new TechnicalOfficer({
        email: "st@xyz.com",
        userType: "student",
      }).viewInventory();
  
      expect(result).toHaveProperty("action", false);
    });

  it("Should return success", async () => {
      Database.mockImplementation(() => {
        return {
          readThreeTable:()=>{
              return Promise.resolve({error:false,result:{rows:[{}]}})
          }
        };
      });
  
      const result = await new TechnicalOfficer({
        email: "st@xyz.com",
        userType: "student",
      }).viewInventory();
  
      expect(result).toHaveProperty("action", true);
    });
});

describe("Get LabId", () => {
    it("Should return failed", async () => {
      Database.mockImplementation(() => {
        return {
          readSingleTable: () => {
            return Promise.resolve({ error: true });
          }
        };
      });
  
      const result = await new TechnicalOfficer({
        email: "st@xyz.com",
        userType: "student",
      }).getLabId();
  
      expect(result).toBe(null);
    });

  it("Should return success", async () => {
      Database.mockImplementation(() => {
        return {
          readSingleTable:()=>{
              return Promise.resolve({error:false,result:{rows:[{lab_id:'1'}]}})
          }
        };
      });
  
      const result = await new TechnicalOfficer({
        email: "st@xyz.com",
        userType: "student",
      }).getLabId();
  
      expect(result).toBe('1');
    });
});

describe("View Borrowed Equipments", () => {
    it("Should return failed", async () => {
      Database.mockImplementation(() => {
        return {
          readSingleTable: () => {
            return Promise.resolve({ error: true });
          }
        };
      });
  
      const result = await new TechnicalOfficer({
        email: "st@xyz.com",
        userType: "student",
      }).viewBorrowedEquipments();
  
      expect(result).toHaveProperty("action",false);
    });

  it("Should return success", async () => {
      Database.mockImplementation(() => {
        return {
          readSingleTable:()=>{
              return Promise.resolve({error:false,result:{rows:[{lab_id:1}],rowCount:1}})
          }
        };
      });
  
      const result = await new TechnicalOfficer({
        email: "st@xyz.com",
        userType: "student",
      }).viewBorrowedEquipments();
  
      expect(result).toHaveProperty("action",true);
    });
});

describe("View Available Equipments", () => {
    it("Should return failed", async () => {
      Database.mockImplementation(() => {
        return {
          readTwoTable: () => {
            return Promise.resolve({ error: true });
          }
        };
      });
  
      const result = await new TechnicalOfficer({
        email: "st@xyz.com",
        userType: "student",
      }).viewAvailableLabEquipment();
  
      expect(result).toHaveProperty("action",false);
    });

  it("Should return success", async () => {
      Database.mockImplementation(() => {
        return {
          readTwoTable:()=>{
              return Promise.resolve({error:false,result:{rows:[{}]}})
          }
        };
      });
  
      const result = await new TechnicalOfficer({
        email: "st@xyz.com",
        userType: "student",
      }).viewAvailableLabEquipment();
  
      expect(result).toHaveProperty("action",true);
    });
});

describe("Get Equip Types", () => {
    it("Should return failed", async () => {
      Database.mockImplementation(() => {
        return {
          readSingleTable: () => {
            return Promise.resolve({ error: true });
          }
        };
      });
  
      const result = await new TechnicalOfficer({
        email: "st@xyz.com",
        userType: "student",
      }).getEquipTypes();
  
      expect(result).toHaveProperty("action",false);
    });

  it("Should return success", async () => {
      Database.mockImplementation(() => {
        return {
          readSingleTable:()=>{
              return Promise.resolve({error:false,result:{rows:[{}],rowCount:1}})
          }
        };
      });
  
      const result = await new TechnicalOfficer({
        email: "st@xyz.com",
        userType: "student",
      }).getEquipTypes();
  
      expect(result).toHaveProperty("action",true);
    });
});


describe("getRequestStats",()=>{
    it ("Should return failed",async ()=>{
     Database.mockImplementation(()=>{
         return{
             readSingleTable:()=>{
                 return Promise.resolve({error:true});
             },
             query:()=>{
                return Promise.resolve({error:true})
             }
         }
     });

     const result=await new TechnicalOfficer({email:"st@xyz.com",userType:"techncial_officer"}).getRequestStats();

     expect(result).toHaveProperty("action",false);
 });

 it ("Should return failed",async ()=>{
    Database.mockImplementation(()=>{
        return{
            readSingleTable:()=>{
                return Promise.resolve({error:false,result:{rows:[{}]}});
            },
            query:()=>{
               return Promise.resolve({error:true})
            }
        }
    });

    const result=await new TechnicalOfficer({email:"st@xyz.com",userType:"techncial_officer"}).getRequestStats();

    expect(result).toHaveProperty("action",false);
});

 it ("Should return failed",async ()=>{
     Database.mockImplementation(()=>{
         return{
            query:()=>{
                return Promise.resolve({error:false,result:{rows:[{}]}});
            },
            readSingleTable:()=>{
               return Promise.resolve({error:true})
            }
         }
     });

     const result=await new TechnicalOfficer({email:"st@xyz.com",userType:"techncial_officer"}).getRequestStats();

     expect(result).toHaveProperty("action",false);
 });
 it ("Should return success",async ()=>{
    Database.mockImplementation(()=>{
        return{
           query:()=>{
               return Promise.resolve({error:false,result:{rows:[{}]}});
           },
           readSingleTable:()=>{
              return Promise.resolve({error:false,result:{rows:[{}]}})
           }
        }
    });

    const result=await new TechnicalOfficer({email:"st@xyz.com",userType:"techncial_officer"}).getRequestStats();

    expect(result).toHaveProperty("action",true);
});
});

describe("getUserStats",()=>{
 it ("Should return failed",async ()=>{
    Database.mockImplementation(()=>{
        return{
            getCount:()=>{
                return Promise.resolve({error:true})
            }
        }
    });

    const result=await new TechnicalOfficer({email:"st@xyz.com",userType:"techncial_officer"}).getUserStats();

    expect(result).toHaveProperty("action",false);
});

 it ("Should return success",async ()=>{
     Database.mockImplementation(()=>{
         return{
             getCount:()=>{
                 return Promise.resolve({error:false,result:{rows:[1]}})
             }
         }
     });

     const result=await new TechnicalOfficer({email:"st@xyz.com",userType:"techncial_officer"}).getUserStats();

     expect(result).toHaveProperty("action",true);
 });
});

describe("getDashBoard Data",()=>{
    it ("Should return failed",async ()=>{
       Database.mockImplementation(()=>{
           return{
               getCount:()=>{
                   return Promise.resolve({error:true})
               },
               readSingleTable:()=>{
                   return Promise.resolve({error:true})
               }
           }
       });
   
       const result=await new TechnicalOfficer({email:"st@xyz.com",userType:"techncial_officer"}).getDashboardDataMob();
   
       expect(result).toHaveProperty("action",false);
   });

   it ("Should return failed",async ()=>{
    Database.mockImplementation(()=>{
        return{
            getCount:()=>{
                return Promise.resolve({error:true})
            },
            readSingleTable:()=>{
                return Promise.resolve({error:false,result:{rows:[{state:0,count:1}]}})
            }
        }
    });

    const result=await new TechnicalOfficer({email:"st@xyz.com",userType:"techncial_officer"}).getDashboardDataMob();

    expect(result).toHaveProperty("action",false);
});

it ("Should return failed",async ()=>{
    Database.mockImplementation(()=>{
        return{
            getCount:()=>{
                return Promise.resolve({error:false,result:{rows:[{}]}})
            },
            readSingleTable:()=>{
                return Promise.resolve({error:true})
            }
        }
    });

    const result=await new TechnicalOfficer({email:"st@xyz.com",userType:"techncial_officer"}).getDashboardDataMob();

    expect(result).toHaveProperty("action",false);
});
   
    it ("Should return success",async ()=>{
        Database.mockImplementation(()=>{
            return{
                readSingleTable:()=>{
                    return Promise.resolve({error:false,result:{rows:[{}]}})
                },
                getCount:()=>{
                    return Promise.resolve({error:false,result:{rows:[{state:0,count:1}]}})
                }
            }
        });
   
        const result=await new TechnicalOfficer({email:"st@xyz.com",userType:"techncial_officer"}).getDashboardDataMob();
   
        expect(result).toHaveProperty("action",true);
    });
   });