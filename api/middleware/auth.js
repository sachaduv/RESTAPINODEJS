const jwt = require('jsonwebtoken');

module.exports = (req,res,next)=>{
    try{
        const token = req.headers.token;
        const decoded = jwt.verify(token,'secret');
        req.userData = decoded;
        next();
    }catch(err){
        return res.status(401).json({
            error : 'Auth Failed!...'
        })
    }
}