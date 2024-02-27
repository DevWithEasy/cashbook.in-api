const jwt = require('jsonwebtoken')
const authenticated=(req,res,next)=>{
    try {
        const token = req.headers['cb-access-token']
        jwt.verify(token,process.env.JWT_SECRET,(err,decode)=>{
            if(err){
                res.status(401).json({
                    status: 500,
                    success : false,
                    message : 'Authentication failed'
                })
            }else{
                req.user = decode
                next()
            }
        })
    } catch (error) {
        res.status(500).json({
            status: 500,
            success : false,
            message : error.message
        })
    }
}

module.exports = authenticated