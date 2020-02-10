const express=require('express');
const router=express.Router();
const passport=require('passport');
const nodemailer=require('nodemailer');
const Token=require('../models/token');
const User=require('../models/User');
const crypto=require('crypto');
const ejs =require('ejs');
const path=require('path');
const userlogs=require('../models/userlogs');
const arrayWrap=require('arraywrap');
const sgTransport=require('nodemailer-sendgrid-transport');


router.get('/',(req,res,next)=>{
  res.sendFile(path.resolve(__dirname, '../views', 'index.html'));
});
router.get('/login',function(req,res,next){
  res.sendFile(path.resolve(__dirname, '../views', 'index.html'));
})
router.get('/terms_and_agreement',(req,res,next)=>{
  res.sendFile(path.resolve(__dirname,'../',  'licence-agreement.pdf'));
})
router.post('/forgetPassword',(req,res,next)=>{
  var phone_Number=req.body.phoneNumber;
  var password=req.body.password;
  var code=req.body.code;
  
  Token.findOne({token:code}).select({"_userId":1}).exec(function(err,token){
    if(err){
      res.send({error:'Could not proceed the request'})
      return;
    }
    if(!token){
      res.send({error:'Your 15 minutes are over token expired'})
      return;
    }
    if(token){
      User.findOne({$and:[{_id:token._userId},{phone_Number:phone_Number}]}).select({"phone_Number":1}).exec(function(err,user){
        if(err){
            res.send({error:'Could not proceed the request'})
            return;
          }
        if(!user){
            res.send({error:'You have entered the wrong phone number or your 15 mints are over'})
          return;
          }
        if(user){
            user.password=password
            user.save(function(err){
              if(err){
                res.send({error:'Could not proceed the request'})
                return;
              }
                res.send({passwordChange:true})
            })
        }
      })
    }
  })
})
router.get('/auth/facebook', passport.authenticate('facebook'));
router.get('/auth/facebook/callback',
passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login',
                                    }));

router.post("/login",function(req,res,next){
  passport.authenticate('local-login',function (err, user, message){
    if (err) {
    return res.send(err.message)
    }
    if (user) {
      req.logIn(user, loginErr => {
        if(loginErr) {
          console.log(loginErr)
          res.json({ success: false, message: loginErr })
          return
        }
        var logs=new userlogs({
          userId:user._id,
          userIp:req.ip,
          actionType:'Logging in',
          sessionId:req.sessionID,
          browsingAgent:req.headers['user-agent'],
        })
        logs.save(next);
        
        res.send({user:user}); 
        return;
      })
  }
    if(message){
      console.log(message)
      return res.send({message:message})
    }
  })(req, res, next);
})

router.post("/signup", function (req, res, next) {
  var username = req.body.username;
  var phoneNumber = req.body.phone;
  var email = req.body.email;
    User.findOne({ $or: [{ username: username }, { email: email }, { phone_Number: phoneNumber }] }, function (err, user) {

    if (err) { 
      res.send({error:'Could not proceed the request'});
      return ; 
    }
    if (user) {
      
      return res.send({message:"user already exists with this email username or phone number"});
    }
  var password = req.body.password;
  var firstName=req.body.firstName;
  var lastName=req.body.lastName;
  var newUser = new User({
      username: username,
      email: email,
      phone_Number: phoneNumber,
      password: password,
      firstName:firstName,
      lastName:lastName
      
    });
 var promise = newUser.save();
     promise.then(doc=>{

     
  var token = new Token({
      _userId: newUser._id,
      token:req.body.email+crypto.randomBytes(16).toString('hex')
    });
    token.save(next);
    
    var logs=new userlogs({
      userId:newUser._id,
      userIp:req.ip,
      actionType:'Creating Profile',
      sessionId:req.sessionID,
      browsingAgent:req.headers['user-agent'],
    })
    logs.save(function(err){if(err){return}})
    
    
  ejs.renderFile(__dirname + '/templates/template.ejs',{token:token.token}, (err, data) => {
      
      if (err) {
       return res.send({message:err.message})  
      }
      else {
      
        var options = {
          auth: {
            api_user: 'shoaib95',
            api_key: '123456fga'
          }
        }
        
        var client = nodemailer.createTransport(sgTransport(options));
        
        var email = {
          from: '<no-reply@tutorns.com>',
          to: 'shoaib.1995.noor@gmail.com',
          subject: 'Tutons account confirmation',
          html: data
        };
        
        client.sendMail(email, function(err, info){
            if (err){
              console.log(err);
               res.send({message:err.message})
               return
              }
            
        });

   
passport.authenticate('local-login',function (err, user, message){
  if (err) {
      return res.send({message:err.message})
  }
  if (user) {
    req.logIn(user,function(loginErr){
      if(loginErr){

        res.send({messag:'Could not proceed with the request'})
        return;
      }
      
        res.send({user:user}) 
        return;   
    })
    
  }
  if(message){
     res.send({message:message})
     return 
  }
})  
  (req, res, next)
}
}) 
  })
   });
  });
router.get('/passwordReset',(req,res)=>{    
      res.sendFile(path.resolve(__dirname, '../views', 'index.html'));
});
router.post('/resetPassword',(req,res,next)=>{
  User.findOne({$or:[{email:req.body.email},{phone_Number:req.body.email}]}).select({"email":1})
  .exec(function(err,user){
    if(err){
      res.send({error:err.message})
      return;
    }
    if(!user){
      res.send({message:'No user exists with this email address'})
      return;
    }
    var token = new Token({
      _userId: user._id,
      token:req.body.email+crypto.randomBytes(16).toString('hex')
    });
    token.save(next);
  ejs.renderFile(__dirname + '/templates/template2.ejs',{token:token.token}, (err, data) => {
      
      if (err) {
       return res.send({message:err.message})  
      }
      else {
      
        var options = {
          auth: {
            api_user: 'shoaib95',
            api_key: '123456fga'
          }
        }
        
        var client = nodemailer.createTransport(sgTransport(options));
        var email = {
          from: '<no-reply@tutorns.com>',
          to: 'shoaibnoor95@hotmail.com',
          subject: 'Tutons account confirmation',
          html: data
        };
        
        client.sendMail(email, function(err, info){
            if (err){
              return res.send({message:err.message})
            }
    
          })
        }
      })
                 res.send({mail:true})
    })
  })
  router.get('/passwordResetToken',(req,res)=>{
    
  Token.findOne({ "token": req.query.id }, function (err, token) {
    if(err){
       res.send({danger:true})
       return;
    }
    if (!token) 
    {
      res.send({danger:true})
      return; 
    }
   
    User.findOne({ _id: token._userId }).select({"emailAuth":1}).exec((err, user)=> {
      if (!user) 
      { 
        res.send({danger:true})
        return;
    }
          if (user.emailAuth)
          { 
            res.send({success:true});
            return;
          }
                  
      user.emailAuth = true;
      user.save(function (err) {
        if (err) { 
              res.send({ danger: true}); 
              return;
      }
              res.send({success:true})
        });
      });
    });
  })
router.get('/password_Reset/274sakldajdaskjaskld23280923089213893kdasjklasjddljkdslskdsladkjasklasdjdssjdkls2398023sknasddasjasdgdas/*',(req,res,next)=>{
  res.sendFile(path.resolve(__dirname, '../views', 'index.html'));
});

 
  router.get('/searching',(req,res)=>{
  var search=arrayWrap(req.query.search ||"");
  var terms= search[0].split(" ")

  User.find({teach:{ $regex:'.*'+terms+'.*'}},'teach',{'group':'teach'}).limit(10).exec(function(err,user){
    if(err) {return res.send({messag:err.message})}
    res.send({users:user})
  });
});
module.exports=router;