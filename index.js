require("dotenv").config()
const path = require("path")
const express = require('express');
const errorHandler = require("./middleware/errorHandler");
const applyMidleware = require("./middleware/middlewares");
const applyRouter = require("./routers/routers");
const dbConnection = require("./config/dbConnection");
const app = express();

app.use(express.static(path.join(__dirname,'public')))

dbConnection()

applyMidleware(app)

applyRouter(app)

errorHandler(app)

app.listen(process.env.PORT || 8080,()=>{
    console.log('Express server listening on port 8080')
})