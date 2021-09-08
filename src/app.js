const express = require('express')
const bcrypt=require('bcrypt');
const cookieParser=require('cookie-parser');
const { application } = require('express');
const config = require('config');
const server = express()
const port = process.env.PORT || 8000

const authRouter=require("./routes/auth");

server.use(express.json())
server.use(express.urlencoded({extended:true}));
server.use(cookieParser());

server.get('/', async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin", salt);
    console.log(hashedPassword);
    res.send('<h1>This is a test application</h1>')
})

server.use("/auth",authRouter);



server.listen(port, () => {
    console.log(`\n=== Server listening on port ${port} ===\n`)
})