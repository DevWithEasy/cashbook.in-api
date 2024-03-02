const {Server} = require('socket.io')

const initSocket=(server)=>{
    const io = new Server(server,{
        // cors : {
        //     'origin' : process.env.NODE_ENV === 'production' ? 'https://amaderdoctor.vercel.app' : 'http://localhost:3000'
        // }
        cors : {
            origin : 'http://localhost:3000'
        }
    })

    io.on('connection',(socket)=>{
        console.log(socket)
        socket.on('join_chat',data=>{
            socket.join(data.id)
            console.log(`join chat ${data.id}`)
        })

    })
}

module.exports = initSocket