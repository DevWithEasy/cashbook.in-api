require("dotenv").config()
const path = require("path")
const http = require('http')
const express = require('express');
const errorHandler = require("./middleware/errorHandler");
const applyMidleware = require("./middleware/middlewares");
const applyRouter = require("./routers/routers");
const dbConnection = require("./config/dbConnection");
const cloudinaryConfig = require("./config/cloudinary");
const initSocket = require("./config/initSocket");
const app = express();

app.use(express.static(path.join(__dirname,'public')))

//create http server
const server = http.createServer(app)

cloudinaryConfig()

dbConnection()

applyMidleware(app)

applyRouter(app)

initSocket(server)

errorHandler(app)

app.listen(process.env.PORT || 8080,()=>{
    console.log('Express server listening on port 8080')
})