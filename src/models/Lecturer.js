const User = require("./User");

class Lecturer extends User{
    constructor(data){
        super(data);
    }

    approve(reqId){

    }

    reject(reqId){

    }

    viewPendingRequests(){

    }

    viewRequestHistory(){

    }

}

module.exports = Lecturer;