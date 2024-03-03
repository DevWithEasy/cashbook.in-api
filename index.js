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
const { Server } = require('socket.io')

app.use(express.static(path.join(__dirname, 'public')))

//create http server
const server = http.createServer(app)
const io = new Server(server, {

    cors: {
        origin: 'http://localhost:3000/'
    }
})

io.on('connection', (socket) => {
    console.log('hello')
    socket.on("connect_error", async err => {
        console.log(`connect_error due to ${err.message}`)
    })

})

cloudinaryConfig()

dbConnection()

applyMidleware(app)

applyRouter(app)

errorHandler(app)

app.listen(process.env.PORT || 8080, () => {
    console.log('Express server listening on port 8080')
})