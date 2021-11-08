const Student = require("../../models/Student");
const Database = require("../../database/database");

jest.mock("../../database/database");
beforeEach(() => {
  Database.mockClear();
});

describe("register", () => {
  it("Should return validation error", async () => {
    const result = await new Student({
      email: "a@x.com",
      userType: "administrator",
    }).register("", "", ",", ",", "");

    expect(result).toHaveProperty("validationError");
  });

  it("Should return validation error", async () => {
    const result = await new Student({
      email: "a@x.com",
      userType: "administrator",
    }).register("1", null, ",", ",", "");

    expect(result).toHaveProperty("validationError");
  });

  it("Should return failed", async () => {
    Database.mockImplementation(() => {
      return {
        insert: () => {
          return Promise.resolve({ error: true });
        },
      };
    });

    const result = await new Student({
      email: "a@x.com",
      userType: "administrator",
    }).register("1", "a", "b", "a@x.com", "0000000000", "a");

    expect(result).toHaveProperty("action", false);
  });

  it("Should return success", async () => {
    Database.mockImplementation(() => {
      return {
        insert: () => {
          return Promise.resolve({ error: false, result: "Something" });
        },
      };
    });

    const result = await new Student({
      email: "a@x.com",
      userType: "student",
    }).register("1", "a", "b", "a@x.com", "0000000000", "a");

    expect(result).toHaveProperty("action", true);
  });
});

describe("Make Borrow Request", () => {
  it("Should return validation error", async () => {
    const result = await new Student({
      email: "a@x.com",
      userType: "administrator",
    }).makeBorrowRequest("", "", "", "", "");

    expect(result).toHaveProperty("validationError");
  });

  it("Should return validation error", async () => {
    const result = await new Student({
      email: "a@x.com",
      userType: "administrator",
    }).makeBorrowRequest("1", null, "", "", "");

    expect(result).toHaveProperty("validationError");
  });

  it("Should return failed", async () => {
    Database.mockImplementation(() => {
      return {
        makeRequest: () => {
          return Promise.resolve({ error: true });
        },
      };
    });

    const result = await new Student({
      email: "a@x.com",
      userType: "administrator",
    }).makeBorrowRequest("1", new Date(), new Date(), "a", [1, 2]);

    expect(result).toHaveProperty("action", false);
  });

  it("Should return success", async () => {
    Database.mockImplementation(() => {
      return {
        makeRequest: () => {
          return Promise.resolve({ error: false, result: "Something" });
        },
      };
    });

    const result = await new Student({
      email: "a@x.com",
      userType: "student",
    }).makeBorrowRequest("1", new Date(), new Date(), "a", [1, 2]);

    expect(result).toHaveProperty("action", true);
  });
});

describe("View All Request", () => {
  it("Should return failed", async () => {
    Database.mockImplementation(() => {
      return {
        readSingleTable: () => {
          return Promise.resolve({ error: true });
        },
      };
    });

    const result = await new Student({
      email: "st@xyz.com",
      userType: "student",
    }).viewAllRequest();

    expect(result).toHaveProperty("action", false);
  });

  it("Should return failed", async () => {
    Database.mockImplementation(() => {
      return {
        readSingleTable: () => {
          return Promise.resolve({ error: true });
        },
      };
    });

    const result = await new Student({
      email: "st@xyz.com",
      userType: "student",
    }).viewAllRequest();

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
                { request_id: 1, date_of_borrowing: new Date(), state: 0 },
              ],
            },
          });
        },
      };
    });

    const result = await new Student({
      email: "st@xyz.com",
      userType: "student",
    }).viewAllRequest();

    expect(result).toHaveProperty("action", true);
  });
});

describe("View Request Detail", () => {
  it("Should return failed", async () => {
    Database.mockImplementation(() => {
      return {
        viewRequest: () => {
          return Promise.resolve({ error: true });
        },
        readSingleTable: () => {
          return Promise.resolve({ error: true });
        },
      };
    });

    const result = await new Student({
      email: "st@xyz.com",
      userType: "student",
    }).viewRequest(1);

    expect(result).toHaveProperty("action", false);
  });

  it("Should return failed", async () => {
    Database.mockImplementation(() => {
      return {
        viewRequest: (reqId) => {
          return Promise.resolve({
            error: false,
            result: {
              rows: [
                {
                  request_id: reqId,
                  date_of_borrowing: new Date(),
                  date_of_returning: new Date(),
                  student_id: "1",
                  type_id: 0,
                  type: "a",
                  brand: "a",
                  eq_id: 1,
                  state: 0,
                },
              ],
            },
          });
        },
        readSingleTable: () => {
          return Promise.resolve({ error: true });
        },
      };
    });

    const result = await new Student({
      email: "st@xyz.com",
      userType: "student",
    }).viewRequest(1);

    expect(result).toHaveProperty("action", false);
  });

  it("Should return success", async () => {
    Database.mockImplementation(() => {
      return {
        viewRequest: (reqId) => {
          return Promise.resolve({
            error: false,
            result: {
              rows: [
                {
                  request_id: reqId,
                  date_of_borrowing: new Date(),
                  date_of_returning: new Date(),
                  student_id: "1",
                  type_id: 0,
                  type: "a",
                  brand: "a",
                  eq_id: 1,
                  state: 0,
                },
              ],
            },
          });
        },
        readSingleTable: () => {
          return Promise.resolve({
            error: false,
            result: { rows: [{ first_name: "a", last_name: "b" }] },
          });
        },
      };
    });

    const result = await new Student({
      email: "st@xyz.com",
      userType: "student",
    }).viewRequest(1);

    expect(result).toHaveProperty("action", true);
  });
});

describe("Check Item Availability", () => {
  it("Should return failed", async () => {
    Database.mockImplementation(() => {
      return {
        readSingleTable: () => {
          return Promise.resolve({ error: true });
        },
      };
    });

    const result = await new Student({
      email: "st@xyz.com",
      userType: "student",
    }).checkItemAvailability([1, 2]);

    expect(result).toHaveProperty("available", false);
  });

  it("Should return failed", async () => {
    Database.mockImplementation(() => {
      return {
        readSingleTable: () => {
          return Promise.resolve({ error: true });
        },
      };
    });

    const result = await new Student({
      email: "st@xyz.com",
      userType: "student",
    }).checkItemAvailability([1, 2]);

    expect(result).toHaveProperty("available", false);
  });

  it("Should return success", async () => {
    Database.mockImplementation(() => {
      return {
        readSingleTable: () => {
          return Promise.resolve({
            error: false,
            result: { rows: [{ state: 1 }] },
          });
        },
      };
    });

    const result = await new Student({
      email: "st@xyz.com",
      userType: "student",
    }).checkItemAvailability([1, 2]);

    expect(result).toHaveProperty("available", false);
  });

  it("Should return success", async () => {
    Database.mockImplementation(() => {
      return {
        readSingleTable: () => {
          return Promise.resolve({
            error: false,
            result: { rows: [{ state: 0 }] },
          });
        },
      };
    });

    const result = await new Student({
      email: "st@xyz.com",
      userType: "student",
    }).checkItemAvailability([1, 2]);

    expect(result).toHaveProperty("available", true);
  });
});

describe("Get Dashboard Data", () => {
  it("Should return failed", async () => {
    Database.mockImplementation(() => {
      return {
        readSingleTable: () => {
          return Promise.resolve({ error: true });
        },
        readTwoTable: () => {
          return Promise.resolve({ error: true });
        },
      };
    });

    const result = await new Student({
      email: "st@xyz.com",
      userType: "student",
    }).getDashboardDataM();

    expect(result).toHaveProperty("action", false);
  });

  it("Should return failed", async () => {
    Database.mockImplementation(() => {
      return {
        readSingleTable: () => {
          return Promise.resolve({ error: true });
        },
        readTwoTable: () => {
          return Promise.resolve({ error: false });
        },
      };
    });

    const result = await new Student({
      email: "st@xyz.com",
      userType: "student",
    }).getDashboardDataM();

    expect(result).toHaveProperty("action", false);
  });

  it("Should return failed", async () => {
    Database.mockImplementation(() => {
      return {
        readSingleTable: () => {
          return Promise.resolve({ error: false });
        },
        readTwoTable: () => {
          return Promise.resolve({ error: true });
        },
      };
    });

    const result = await new Student({
      email: "st@xyz.com",
      userType: "student",
    }).getDashboardDataM();

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
                { request_id: 1, date_of_borrowing: new Date(), state: 0 },
              ],
            },
          });
        },
        readTwoTable: () => {
          return Promise.resolve({
            error: false,
            result: { rows: [{}], rowCount: 1 },
          });
        },
      };
    });

    const result = await new Student({
      email: "st@xyz.com",
      userType: "student",
    }).getDashboardDataM();

    expect(result).toHaveProperty("action", true);
  });
});

describe("View Borrowed History", () => {
  it("Should return failed", async () => {
    Database.mockImplementation(() => {
      return {
        readSingleTable: () => {
          return Promise.resolve({ error: true });
        },
        readTwoTable: () => {
          return Promise.resolve({ error: true });
        },
      };
    });

    const result = await new Student({
      email: "st@xyz.com",
      userType: "student",
    }).viewBorrowedHistory();

    expect(result).toHaveProperty("action", false);
  });

  it("Should return failed", async () => {
    Database.mockImplementation(() => {
      return {
        readSingleTable: () => {
          return Promise.resolve({ error: true });
        },
        readTwoTable: () => {
          return Promise.resolve({ error: false });
        },
      };
    });

    const result = await new Student({
      email: "st@xyz.com",
      userType: "student",
    }).viewBorrowedHistory();

    expect(result).toHaveProperty("action", false);
  });

  it("Should return failed", async () => {
    Database.mockImplementation(() => {
      return {
        readSingleTable: () => {
          return Promise.resolve({ error: false });
        },
        readTwoTable: () => {
          return Promise.resolve({ error: true });
        },
      };
    });

    const result = await new Student({
      email: "st@xyz.com",
      userType: "student",
    }).viewBorrowedHistory();

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
                { request_id: 1, date_of_borrowing: new Date(), state: 0 },
              ],
            },
          });
        },
        readTwoTable: () => {
          return Promise.resolve({
            error: false,
            result: {
              rows: [
                {
                  date_of_borrowing: new Date(),
                  date_of_returning: new Date(),
                },
              ],
              rowCount: 1,
            },
          });
        },
      };
    });

    const result = await new Student({
      email: "st@xyz.com",
      userType: "student",
    }).viewBorrowedHistory();

    expect(result).toHaveProperty("action", true);
  });
});

describe("View Borrowed Details", () => {
  it("Should return failed", async () => {
    Database.mockImplementation(() => {
      return {
        readSingleTable: () => {
          return Promise.resolve({ error: true });
        },

        viewNormalBorrowed: () => {
          return Promise.resolve({ error: true });
        },
      };
    });

    const result = await new Student({
      email: "st@xyz.com",
      userType: "student",
    }).viewBorrowDetails(1, "normal");

    expect(result).toHaveProperty("action", false);
  });

  it("Should return failed", async () => {
    Database.mockImplementation(() => {
      return {
        readSingleTable: () => {
          return Promise.resolve({ error: false, result: { rows: [{}] } });
        },

        viewNormalBorrowed: () => {
          return Promise.resolve({ error: true });
        },
      };
    });

    const result = await new Student({
      email: "st@xyz.com",
      userType: "student",
    }).viewBorrowDetails(1, "normal");

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
                { request_id: 1, date_of_borrowing: new Date(), state: 0 },
              ],
            },
          });
        },

        viewNormalBorrowed: () => {
          return Promise.resolve({
            error: false,
            result: {
              rows: [
                {
                  date_of_borrowing: new Date(),
                  date_of_returning: new Date(),
                },
              ],
              rowCount: 1,
            },
          });
        },
      };
    });

    const result = await new Student({
      email: "st@xyz.com",
      userType: "student",
    }).viewBorrowDetails(1, "normal");

    expect(result).toHaveProperty("action", true);
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
  
      const result = await new Student({
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
  
      const result = await new Student({
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
  
      const result = await new Student({
        email: "st@xyz.com",
        userType: "student",
      }).getLabs();
  
      expect(result).toHaveProperty("action", true);
    });
  });

  describe("Get Lecturers", () => {
    it("Should return failed", async () => {
      Database.mockImplementation(() => {
        return {
          readSingleTable: () => {
            return Promise.resolve({ error: true });
          }
        };
      });
  
      const result = await new Student({
        email: "st@xyz.com",
        userType: "student",
      }).getLecturers();
  
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
  
      const result = await new Student({
        email: "st@xyz.com",
        userType: "student",
      }).getLecturers();
  
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
  
      const result = await new Student({
        email: "st@xyz.com",
        userType: "student",
      }).getLecturers();
  
      expect(result).toHaveProperty("action", true);
    });
  });