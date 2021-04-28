const User = require("../models/user"); 
const { validationResult } = require('express-validator');
const jwt= require("jsonwebtoken");
const expressJwt= require("express-jwt");


exports.signin=(req,res)=>{
    
    const errors= validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ 
            errors: errors.array()[0].msg
        });
      }
    //extracting user from DB
    const {email,password} = req.body;
    
      User.findOne({email: email},(err,user)=>{
        if(err || !user){
            return res.status(400).json({
                  error : "user doesn't exist"
            })
        }
      

        if(!user.authenticate(password)){
            return res.status(401).json({
                error: "email and password missmatched"
            })
        }
      
        //token creation
        const token = jwt.sign({ _id: user._id }, process.env.SECRET);
        //put token in cookie
        res.cookie("token",token,{expire: new Date + 9999});
        //send responce to front end
        // var {_id,name,email,role} = user;
        return res.json({token, _id:user._id,name:user.name,email:user.email,role:user.role});
    })
}


exports.signup=(req,res)=>{
    const errors= validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ 
            errors: errors.array()[0].msg
        });
      }

    const user = new User(req.body)
    user.save((err,user)=>{
        if(err){
            return res.status(400).json({
                err:"Not able to save user in DB"
            })
        }
        res.json({
            name: user.name,
            email: user.email,
            id: user._id
        })
    })
}

exports.signout=(req,res)=>{
    res.clearCookie("token");
    res.json({
        message:"user signout successfull"
    });
}

//protected routes
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth" ,
    algorithms:["HS256"]
})

//custom middlewares
exports.isAuthenticated=(req,res,next)=>{
    
    const checker=req.profile && req.auth && req.profile._id==req.auth._id;
    
    if(!checker){
        return res.status(403).json({
            error : "ACCESS DENIED"
        })
    }
    next()
}

exports.isAdmin=(req,res,next)=>{
    if(req.profile.role===0){
        return res.status(403).json({
            error : "YOU ARE NOT ADMIN , ACCESS DENIED"
        })
    }
    next()
}