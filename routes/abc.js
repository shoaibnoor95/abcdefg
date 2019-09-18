const router=require('express').Router();
const passport=require('passport');
const crypto=require('crypto');
const User=require('../models/User');
const FileSchema=require('../models/files');
const fs=require('fs');
const Posts=require('../models/post');
const sgTransport=require('nodemailer-sendgrid-transport');
const nodemailer=require('nodemailer');
const path=require('path');
const ejs=require('ejs');
function ensrAuthe(req,res,next){
  if(req.user.type=='admins')
{

  next();
}
else{
  res.send({auth:false})
}
}


router.get('/239802839sdkjlsdajlkdsajlksdajklsadkjlasdkjlasjklasd',(req,res,next)=>{
    res.sendFile(path.resolve(__dirname, '../views', 'index.html'));
});
router.post('/239802839sdkjlsdajlkdsajlksdajklsadkjlasdkjlasjklasd',(req,res,next)=>{
  passport.authenticate('local-login', function (err, user, message){
        if (err) {
        return res.send({error:'Could not proceed the request'})
        }
        if (user) {
          req.logIn(user, loginErr => {
            if(loginErr) {
              return res.send({ success: false, message: 'Could not proceed with the request' })
            }
              console.log(user)
              return res.send({userinc:true}); 
        })
      }
        if(message){
          return res.send({message:message})
        }
      })(req, res, next);
});
router.get('/239802839sdkjlsdajlkdsajlksdajklsadkjlasdkjlasjklasd/logo',(req,res,next)=>{
  res.sendFile(path.resolve(__dirname, '../views', 'index.html'));
})

router.get('/khjadsshjasdasdasdjasdeewwqehjtrjkhrjkwiuewruiowe/logie',ensrAuthe,(req,res,next)=>{
  res.sendFile(path.resolve(__dirname, '../views', 'index.html'));
})

router.get('/khjadsshjasdasdasdjasdeewwqehjtrjkhrjkwiuewruiowes/logie',ensrAuthe,(req,res,next)=>{
  
User.find({$and:[{approved:false},{fileAuth:true},{emailAuth:true},{phoneAuth:true}]}).select({firstName:1,lastName:1,username:1,_id:1}).exec((err,user)=>{
  if(err){
    console.log(err)
    res.send({error:'Could not proceed with the request'})
    return;
  }
  if(!user){
    res.send({message:'No pending request found'})
    return;
  }
  if(user){
    
    res.send({user:user})
    return;
    }
  })
})

router.post('/khjadsshjasdaslassldasdjasdeellkwwqehjtrjkhrjkwiuewruiowes/logie',(req,res,next)=>{
  let ide=req.body.fId;
  FileSchema.findOne({_userId:ide},function(err,files){
  
    fs.writeFile(req.body.username+".rar",files.files.data,function(err){
    if(err){
      console.log(err)
      res.send({error:'Could not proceed with the request'})
      return;
    }
    if(!files){
      console.log('no file found ');
      return;
    }
    var file=__dirname+"/../"+req.body.username+".rar";
     res.download(file,function(err){
     if(err) {console.log(err);
      console.log('shoaib')
      return;}
      fs.unlink('./'+req.body.username+".rar",function(err){
      if(err){
        console.log(err); 
        return; }
      })    
    })   
  })   
})
      //  res.send({download:true})
})  
router.get('/khjadsshjasdaslassldasdjasdeellkwwqehjtrjkhrjkwiuewruiowes',ensrAuthe,(req,res,next)=>{
    res.sendFile(path.resolve(__dirname, '../views', 'index.html'));
});

router.get('/ddskjfsdklfsfskljfsdreuewiw',ensrAuthe,(req,res,next)=>{
  User.findOne({username:req.query.user}).select({"username":1,"firstName":1,'email':1,spec1:1,
'phone_Number':1,'area':1,'city':1,'dOb':1,'moto':1,'hobby':1,'institue':1,
'postalCode':1,'country':1,'teach':1,'cnic':1,'ans1':1,'ans2':1,'ans3':1,'gender':1,'approved':1,'qualification':1,'lastName':1,
'createdAt':1,"changeEmail":1,'study':1,'type':1,'school':1,'subject':1,'learn':1}).exec(function(err,user){
  if(err){
      console.log(err);
       res.send({error:'Could not proceed with the request'});
       return;
  }
    if(user){
      console.log(user)
       res.send({user:user})
       return;
          }
       res.send({message:'No user found'})
      })
    })
router.post('/lkjaweqwqupiew231oweiopqeqopeeqwkqeopiqeoiqeopzxcbv/aslkjads',ensrAuthe,(req,res,next)=>{
  User.findOneAndUpdate({_id:req.body.userIde},{approved:true},(err)=>{
    if(err){
      console.log(err)
      res.send({error:'Could not proceed with the request'})
      return;
    }
     res.send({profileApprove:true})
  })
})
router.post('/lkjaweqwqupiew231oweiopqeqopeeqwkqeopiqeoiqeopzxcbv/deletes',ensrAuthe,(req,res,next)=>{
  User.findOneAndDelete({_id:req.body.userIde},(err)=>{
    if(err){
      console.log(err)
      res.send({error:'Could not proceed with the request'})
      return;
    }
      res.send({profileDelete:true})
  })
})
router.post('/shoaibmnooradminportals',(req,res,next)=>{
console.log(req.body.username)
  User.findOne ({username:req.body.username},function(err,user){
    if(err){
      console.log(err)
      res.send({error:'Could not proceed with the request'})
      return 
    }
    if(!user){
      console.log('User not found')
      res.send({message:true})
      return;
    }
    if(user){
     
      var pass=crypto.randomBytes(8).toString('hex');
      user.password=pass;
      user.save(next);
      var options = {
        auth: {
          api_user: 'shoaib95',
          api_key: '123456fga'
        }
    }
    
    
    var email = {
      from: '<admin@tutorns.com>',
      to: 'shoaibnoor95@hotmail.com',
      subject: 'Tutons account confirmation',
      html: pass
    };
    var client = nodemailer.createTransport(sgTransport(options));
    client.sendMail(email, function(err, info){
      if (err){
        return res.send({message:'Could not proceed with the request'})
      }
    })
        res.send({done:'abc'})
    
  }
})
 
//   var user=new User({
//     username:req.body.username,
//     email:'mail.shoaib95@gmail.com',
//     password:'notre9uired',
//     phone_Number:'33362039773',
//     fileAuth:true,
//     phoneAuth:true,
//     emailAuth:true,
//     type:'admins',
//     approved:true
//   })
//   user.save(function(err){
//     if(err){
//       console.log(err)
//       return;
//     }
//       console.log('done')
//  });

})
router.post('/lkjaweqwqupiew231oweiopqeqopeeqwkqeopiqeoiqeopzxcbvsearch/deletes',(req,res,next)=>{
  User.findOne({$or:[{username:req.body.search},{phone_Number:req.body.search},{email:req.body.search}]}).select({"firstName":1,"lastName":1,"username":1}).exec((err,user)=>{
    if(err){
      console.log(err)
      res.send({error:'Could not proceed with the request'})
      return;
      }
      res.send({user:user})
    })
  });
 
router.post('/lkjaweqwqupiew231oweiopqeqopeeqwkqeopiqeoiqeopzxcbvdeactive/aslkjads',ensrAuthe,(req,res,next)=>{
  User.findOneAndUpdate({_id:req.body.userIde},{approved:false},(err)=>{
    if(err){
      console.log(err)
      res.send({error:'Could not proceed with the request'})
      return;
    }
      res.send({profileApprove:true})
  })
})
router.get('/243adssssdasdsadsadsaaddsadsadsacsadsdsdsadsadsadsadsadsacx/sdaasddsa',(req,res,next)=>{
  var approvedRequest=0,totalUsers=0,temporaryUser=0,offerCount=0,tuitionCount=0,teacherCount=0,studentCount=0;
  User.count({phoneAuth:false},function(err,fakeUser){
    if(err){
      console.log(err)
     temporaryUser=-1;
    }
      if(fakeUser){
        console.log(fakeUser)
        temporaryUser=fakeUser;  
      }
    User.count({$and:[{fileAuth:true},{emailAuth:true},{phoneAuth:true},{approved:false}]},(err,total)=>{
        if(err){
          console.log(err);
          approvedRequest=-1
          }
        if(total){
            approvedRequest=total;
        }
      User.count({approved:true},function(err,inUsers){
    if(err){
      console.log(err)
      inUsers=-1;
    } 
    if(inUsers){
      totalUser=inUsers;    
       }
       Posts.count({type:'offer'},function(err,offers){
         if(err){
           console.log(err)
           offerCount=-1;
         }
         if(offers){
           offerCount=offers
         }
    Posts.count({type:'tuition'},function(err,tuition){
            if(err){
              tuitionCount=-1;
              console.log(err);
            }
            if(tuition){
              tuitionCount=tuition
            }
    User.count({type:'teacher'},function(err,teachers){
      if(err){
        console.log(err)
        teacherCount=-1;
      }
      if(teachers){
        teacherCount=teachers;
      }
      User.count({type:'student'},function(err,students){
        if(err){
          console.log(err)
          studentCount=-1;
        }
        if(students){
          studentCount=students;
        }
        
      var countings={
        totalUser:totalUsers,
        temporaryUser:temporaryUser,
        tuition:tuitionCount,
        offer:offerCount,
        approvedRequest:approvedRequest,      
        studentCount:studentCount,
        teacherCount:teacherCount
      }
        console.log(countings)
        res.send({countings:countings})
                })
             })
          })
        })        
       })    
    })
  })
})
router.get('/midtownmaddnessn4sgta',(req,res,next)=>{
  res.sendFile(path.resolve(__dirname, '../views', 'index.html'));
})
module.exports=router;