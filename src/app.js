const express = require('express')
const bcrypt=require('bcrypt');
const cors=require('cors');
const cookieParser=require('cookie-parser');
const { application } = require('express');
const server = express()
const cron=require('node-cron');
const port = process.env.PORT || 8000

const authRouter=require("./routes/auth");
const adminRouter=require("./routes/admin");
const studentRouter = require('./routes/student');
const TORouter=require("./routes/technicalOfficer");
const lecturerRouter=require('./routes/lecturer')

server.use(express.json())
server.use(express.urlencoded({extended:true}));
server.use(cookieParser());
server.use(cors({origin: "http://localhost:3000", credentials: true}));


server.get('/', (req, res) => {
    res.send('<h1>This is a test application</h1>')
})

server.use("/auth",authRouter);
server.use("/admin",adminRouter);
server.use("/student",studentRouter);
server.use("/techOff",TORouter);
server.use("/lecturer",lecturerRouter);

// cron.schedule('* * * * *', () => {
//     console.log('Running a job at 01:00 at America/Sao_Paulo timezone');
//   }, {
//     scheduled: true,
//     timezone: "Asia/Colombo"
//   });
cron.schedule('* */1 * * *', () => {
    console.log("affaef");
    console.log(new Date().toLocaleString());
  });

server.listen(port, () => {
    console.log(`\n=== Server listening on port ${port} ===\n`)
})