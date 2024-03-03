const { Server } = require('socket.io')

const initSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:3000'
        }
    })

    io.on('connection', (socket) => {
        socket.on('join_cashbook', data => {
            console.log(data)
            socket.join(_id)
        })

    })
}

module.exports = initSocket