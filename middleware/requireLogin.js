const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const userModel = require('../model/user');

const requireLogin = (req,res,next) =>{
    const {authorization} = req.headers;
    if(!authorization){
        return res.status(401).json({err:"Login First!"});
    }

    const token = authorization.replace("Bearer ","");
    
    jwt.verify(token, JWT_SECRET,(err,payload) =>{
        if(err){
            return res.status(401).json({err:"Login First!"});
        }
        const {_id} = payload;
        userModel.findById(_id).then((userData) =>{
            req.user = userData
            next();
        })
    })
}

module.exports = requireLogin;