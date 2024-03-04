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

        socket.on('add_business',data=>{
            const {_id,business} = data
            socket.to(_id).emit('add_business_client',business)
        })

        socket.on('remove_business',data=>{
            const {_id,b_id} = data
            socket.to(_id).emit('remove_business_client',{id : b_id})
        })
    })
}

module.exports = initSocket