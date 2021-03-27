const User = require('../models/user');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

exports.users_login_user = (req,res,next)=>{
    User.find({email : req.body.email}).exec().then((result)=>{
        if(result.length<1){
            return res.status(401).json({
                message : 'Auth Failed!...'
            })
        }else{
            bcrypt.compare(req.body.password,result[0].password,(err,results)=>{
                if(err){
                    return res.status(401).json({
                        message : 'Auth Failed!...'
                    })
                }
                if(results){
                    const token = jwt.sign({
                      email : result[0].email,
                      id : result[0]._id  
                    },'secret',{
                        expiresIn:'1h'
                    })
                    return res.status(200).json({
                        message : 'Auth Sucessfull!...',
                        token : token
                    })
                }
                res.status(401).json({
                    message : 'Auth Failed!...'
                })
            })
        }
    }).catch((err)=>{
        res.status(500).json({
            message : 'Auth Failed!...'
        })
    })
}

exports.users_create_user = (req,res,next)=>{
    User.find({email : req.body.email}).exec().then((user)=>{
        if(user.length > 0){
            return res.status(409).json({
                _id : user[0]._id,
                message : 'user already exists'
            })
        }
        else{
            bcrypt.hash(req.body.password,10,(err,hash)=>{
                if(err){
                    return res.status(500).json({
                        error : err
                    })
                }else{
                    const user = new User({
                        _id : new mongoose.Types.ObjectId(),
                        email : req.body.email,
                        password : hash
                    })
                    user.save().then((result)=>{
                        console.log(result);
                        return res.status(201).json({
                            result : result
                        })
                    }).catch(err=>{
                        console.log(err);
                        return res.status(500).json({
                            error : err
                        })
                    })
                }
            })
        }
    })
}

exports.users_delete_user = (req,res,next)=>{
    User.remove({_id : req.params.userId}).exec().then((result)=>{
        res.status(200).json({
            message : 'user deleted'
        })
    }).catch(err =>{
        res.status(500).json({
            error : err
        })
    })
}

exports.users_get_all_users = (req,res,next)=>{
    User.find().exec().then((result)=>{res.status(200).json({
        users : result
    })}).catch((err)=>{
        res.status(500).json({
            error : err
        })
    })
}