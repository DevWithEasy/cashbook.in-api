const { Server } = require('socket.io')

const initSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:3000'
        }
    })

    io.on('connection', (socket) => {
        socket.on('join_cashbook', data => {
            socket.join(data._id)
        })
        socket.on('update_business',data=>{
            const {business} = data
            if(business?.teams.length > 0){
                business?.teams.forEach(member=>{
                    socket.to(member.user._id).emit('update_business_client',business)
                })
            }
        })
    })
}

module.exports = initSocket