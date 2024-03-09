const { Server } = require('socket.io')
const Book = require('../models/Book')

const initSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.NODE_ENV === 'production' ? 'https://cashbook-in.vercel.app/' : 'http://localhost:3000'
        }
    })

    io.on('connection', (socket) => {

        socket.on('join_cashbook', data => {
            socket.join(data._id)
        })

        //=============Business==============

        //update business
        socket.on('update_business', data => {
            const { business } = data
            if (business?.teams.length > 0) {
                business?.teams.forEach(member => {
                    socket.to(member.user._id).emit('update_business_client', business)
                })
            }
        })

        //add team member
        socket.on('add_business', data => {
            const { _id, business } = data
            socket.to(_id).emit('add_business_client', business)
        })

        //remove team member
        socket.on('remove_business', data => {
            const { _id, b_id, business } = data
            socket.to(_id).emit('remove_business_client', { id: b_id })

            if (business?.teams.length > 0) {
                business?.teams.forEach(member => {
                    socket.to(member.user._id).emit('update_business_client', business)
                })
            }
        })

        //=============Business==============

        //=============Book==================

        //update book
        socket.on('update_book', data => {
            const { book } = data
            if (book?.members.length > 0) {
                book?.members.forEach(member => {
                    socket.to(member.user._id).emit('update_book_client', book)
                })
            }
        })

        //book member
        socket.on('add_team', data => {
            const { _id, book } = data
            socket.to(_id).emit('add_team_client', book)
            if (book?.members.length > 0) {
                book?.members.forEach(member => {
                    socket.to(member.user._id).emit('update_book_client', book)
                })
            }
        })

        //remove team member
        socket.on('remove_team', data => {
            const { _id, book } = data
            socket.to(_id).emit('remove_team_client', book)
            if (book?.members.length > 0) {
                book?.members.forEach(member => {
                    socket.to(member.user._id).emit('update_book_client', book)
                })
            }
        })

        //=============Book=================

        //===========transection============

        //add transecion
        socket.on('add_transection', async (id) => {
            try {
                const book = await Book.findById(id)
                book.members.forEach(m => {
                    socket.to(m.user.toString()).emit('client_add_transection', { book: book._id, business: book.business })
                })
            } catch (error) {
                console.log(error)
            }
        })

        //update transecion
        socket.on('update_transection', async (data) => {
            const { id, entry } = data
            try {
                const book = await Book.findById(id)
                book.members.forEach(m => {
                    socket.to(m.user.toString()).emit('client_update_transection', { book: book._id, business: book.business, entry })
                })
            } catch (error) {
                console.log(error)
            }
        })

        //update transecion
        socket.on('delete_transection', async (data) => {
            const { id, entry } = data
            try {
                const book = await Book.findById(id)
                book.members.forEach(m => {
                    socket.to(m.user.toString()).emit('client_delete_transection', { book: book._id, business: book.business, entry })
                })
            } catch (error) {
                console.log(error)
            }
        })

        //import transecion
        socket.on('import_transecion', async (data) => {
            const { id } = data
            try {
                const book = await Book.findById(id)
                book.members.forEach(m => {
                    socket.to(m.user.toString()).emit('client_import_transecion', { book: book._id, business: book.business })
                })
            } catch (error) {
                console.log(error)
            }
        })

        //===========transection============
    })
}

module.exports = initSocket