const userRouters = require('./userRouters')
const businessRouter = require('./businessRouters')
const bookRouter = require('./bookRouters')
const transectionRouter = require('./transectionsRouters')
const categoryRouter = require('./categoryRouters')
const contactRouter = require('./contactRouters')
const paymentRouter = require('./paymentRouters')

const routers = [
    {
        path : '/api/user',
        handler : userRouters
    },
    {
        path : '/api/business',
        handler : businessRouter
    },
    {
        path : '/api/book',
        handler : bookRouter
    },
    {
        path : '/api/transection',
        handler : transectionRouter
    },
    {
        path : '/api/category',
        handler : categoryRouter
    },
    {
        path : '/api/contact',
        handler : contactRouter
    },
    {
        path : '/api/payment',
        handler : paymentRouter
    },
    {
        path : '/',
        handler : (req,res) =>{
            res.json({
                status : 200,
                success : true,
                message : 'Server successfully running...'
            })
        }
    }
]

const applyRouter = (app) =>{
    routers.map(r=>{
        if(r.path === '/'){
            app.get(r.path,r.handler)
        }else{
            app.use(r.path,r.handler)
        }
    })
}

module.exports = applyRouter