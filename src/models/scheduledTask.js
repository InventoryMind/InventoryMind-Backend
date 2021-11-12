const cron = require('node-cron');
const Database=require("../database/database");
const Email=require("../utils/Email");

const task=cron.schedule('0 0 0 * * *', async() => {
    console.log("affaef");
    console.log(new Date().toLocaleString());
    let database=new Database();
    let email=await new Email();

//Update databse to mark delayed borrowings
    let normalBorrowed=await database.query("select distinct * from normal_borrowing join request using (request_id) where normal_borrowing.state=0 and date_of_returning<=now()");
    // console.log(normalBorrowed)
    if(!normalBorrowed.error){
        normalBorrowed=normalBorrowed.result.rows;
        normalBorrowed.forEach(async(element)=>{
                await database.update("normal_borrowing",["state","=",1,"borrow_id","=",element.borrow_id]);
        })
    }

    let tempBorrowed=await database.query("select * from temporary_borrowing where state=0 and date_of_borrowing<=now()");
    // console.log(tempBorrowed)
    if(!tempBorrowed.error){
        tempBorrowed=tempBorrowed.result.rows;
        tempBorrowed.forEach(async(element)=>{
                await database.update("temporary_borrowing",["state","=",1,"borrow_id","=",element.borrow_id]);
        })
    }

//Send Reminders as email to the students
    let normalBorrowedDelayed=await database.query("select distinct * from normal_borrowing join request using(request_id) join student on request.student_id=student.user_id where normal_borrowing.state=1");
    if(!normalBorrowedDelayed.error){
        normalBorrowedDelayed=normalBorrowedDelayed.result.rows;
        // console.log(normalBorrowedDelayed)
        normalBorrowedDelayed.forEach(async (element) => {
            await email.send(element.email,"Delayed Returning of Borrowed Equipments","You have delayed to return a borrwing.\nBorrow ID: "+element.borrow_id+"\nType: Normal Borrowing\nBorrowed Date:"+new Date(element.date_of_borrowing).toLocaleString().split(",")[0]+".\nYour returning date was "+new Date(element.date_of_returning).toLocaleString().split(",")[0]+". \nPlease return the equipments as soon as possible.")
            console.log("email sent normal")
        });
    }

    let tempBorrowedDelayed=await database.query("select distinct * from temporary_borrowing join student on temporary_borrowing.student_id=student.user_id where state=1");
    if(!tempBorrowedDelayed.error){
        tempBorrowedDelayed=tempBorrowedDelayed.result.rows;
        // console.log(tempBorrowedDelayed)
        tempBorrowedDelayed.forEach(async (element) => {
            await email.send(element.email,"Delayed Returning of Borrowed Equipments","You have delayed to return a borrwing.\nBorrow ID: "+element.borrow_id+"\nType: Temporary Borrowing"+"\nBorrowed Date:"+new Date(element.date_of_borrowing).toLocaleString().split(",")[0]+".\nPlease return the equipments today.").then((res)=>console.log(res))
            console.log("email sent temp")
        });
    }

  

  });

  module.exports=task;