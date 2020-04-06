const express = require('express')
const path = require('path')
require('./routers/user')
require('../mongodb')
bodyParser = require('body-parser')
// to ensure that mongoose is working
require('./db/mongoose')
const User = require('./models/user')
const userRouter = require('./routers/user')

const app = express()
const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, '../public')
console.log(publicDirectoryPath)
app.use(express.static(publicDirectoryPath))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded())  
app.use(userRouter)



app.listen(port, ()=>{
    console.log('Server is up on port '+port)
})