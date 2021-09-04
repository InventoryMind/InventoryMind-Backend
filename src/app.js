require('dotenv').config()

const express = require('express')
const cors = require('cors')
const bcrypt=require('bcrypt');
const server = express()
const port = process.env.PORT || 8000

server.use(cors())
server.use(express.json())

server.get('/', (req, res) => {
    res.send('<h1>This is a test application</h1>')
})

server.get('/hi', async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin", salt);
    console.log(hashedPassword);
    res.send('<h1>$hashassword</h1>');
})

server.listen(port, () => {
    console.log(`\n=== Server listening on port ${port} ===\n`)
})