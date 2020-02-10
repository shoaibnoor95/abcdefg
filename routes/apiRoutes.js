const router=require('express').Router();
const User=require('../models/User');
const Token=require('../models/token');
const fs=require('fs');
const fileSchema=require('../models/files');
const path=require('path');
const nodemailer=require('nodemailer');
const crypto=require('crypto');
const sgTransport=require('nodemailer-sendgrid-transport');
const ejs =require('ejs');
const sessions=require('../models/sessions')
const pathImg='./public/default_1.png';
const pathImg2='./public/default_cover.png';
const posts=require('../models/post');
const userstats=require('../models/userstats')
const arrayWrap=require('arraywrap'); 
const coverPic=require('../models/coverphoto');
const feedback=require('../models/complain');
const notifyDb=require('../models/notifications');
function ensureAuth(req,res,next){
  if(!req.isAuthenticated()){
    res.sendFile(path.resolve(__dirname, '../views', 'ensure.html'));  
    return;
  }
  else{
      next();
      }
}

router.post('/makePost',ensureAuth,(req,res,next)=>{
userstats.findOne({_userId:req.user._id}).select({"offerRemaining":1,'tuitionRemaining':1}).exec(function(err,stats){
  if(err){
    res.send({save:false})
    return;
  }
  if(!stats){
    console.log('stats not found')
    res.send({save:false})
    return;
  }
  
  if(req.user.type=="student"){
    if(stats.tuitionRemaining==0){
      res.send({message:true,save:false})
      return;
    }
    else{
      var posting=new posts({
        _userId:req.user._id,
        class:req.body.class,
        area:req.body.area,
        city:req.body.city,
        requiredTeacherSpecification:req.body.requiredTeacherSpecification,
        studentGender:req.body.studentGender,
        type:'tuition',
      });
      
      posting.category=posting.category.slice();
      posting.category[0]=req.body.category[0];
      posting.category[1]=req.body.category[1];
      posting.category[2]=req.body.category[2];
      posting.save(function(err){
        if(err){
          res.send({save:false})
          return;
        }
        stats.tutionRemaining=stats.offerRemaining-1;
        stats.save(function(err){
          if(err){
            res.send({save:false})
            return;
          }
          res.send({save:true,postId:posting._id})
        })  
      });
      }
    }
  else{
    if(stats.offerRemaining==0){
     res.send({message:true,save:false})
      return;
    }
    else{

      var posting=new posts({
        _userId:req.user._id,
        favoriteArea:req.body.favoriteArea,
        offerContent:req.body.offerContent,
        city:req.body.city,
        type:'offer',
      });
      
      posting.category=posting.category.slice();
      posting.category[0]=req.body.category[0];
      posting.category[1]=req.body.category[1];
      posting.category[2]=req.body.category[2];
      posting.save(function(err){
        if(err){
          res.send({save:false})
          return;
        }
        stats.offerRemaining=stats.offerRemaining-1;
        stats.save(function(err){
          if(err){
            res.send({save:false})
            return;
          }
          res.send({save:true,postId:posting._id})
        });     
      })
    }
      }
    })
    
  })  
    

 
router.post('/filing',ensureAuth,(req,res,next)=>{
  var files=new fileSchema({
    "files.data":req.files.myFile.data,
    _userId:req.user._id,
    contentType:'zip/rar'
  })
  files.save(function(err){
    if(err){
      return res.send({error:err.message})
    }
    req.user.fileAuth=true;
    req.user.save(function(err){
      if(err){
        console.log(err)
        res.send({error:err.message})
      }
      res.send({fileSaved:true})
    })
  })
})
router.post('/makeComplain',ensureAuth,(req,res,next)=>{
  var newComplain=new feedback({
    username:req.user.username,
    email:req.user.email,
    type:req.body.type,
    text:req.body.text
  })
  newComplain.save(function(err){

    if(err){
      res.send({forward:false})
      return;
    }
      res.send({forward:true})
    
  })

})
router.get('/logout',ensureAuth,function(req,res,next){
 
  
  userstats.findOneAndUpdate({_userId:req.user._id},{onLine:false,lastLogin:Date.now()}).exec(function(err){
    if(err){
      return res.send({error:err.message})
    }
    sessions.remove({username :req.user.username },function(err){
        if(err){
          return res.send({error:err.message})
        }
        req.logOut();
        res.send({logout:true}) 
        })
     })
   })


   router.get('/users',ensureAuth,(req,res,next)=>{
     var search=arrayWrap(req.query.user ||"");
    var terms= search[0].split(" ")
   if(terms[0]===req.user.username){
    //  var room=new rooms({
    //    _userId:[req.user._id],
    //    roomType:'notifications',
    //    roomId:req.user._id+"notifications"
    //  })
    //  room.save(function(err){
    //    if(err){
    //      console.log(err)
    //    }
    //    userstats.findOneAndUpdate({_userId:req.user._id},{room:room.roomId}).exec(function(err){
    //      if(err){
    //        return;
    //      }
    //      console.log(room.roomId)
        
    //    })
    //  })
  // var stats=new userstats({
  //   _userId:req.user._id,
  //   RemainingConnect:30,
  //   connsume:0,
  //   totalApplies:0,
  //   offerRemaining:5,
  //   tutionRemaining:10,
  //   totalPosted:0
  // })
  //   stats.save(function(err){
  //     if(err){
  //       return;
  //     }
  // });
  //  var cover =new coverPic({
  //   "coverPhoto.data":fs.readFileSync(pathImg2),
  //   "coverPhoto.content":'Cover photo',
  //   _userId:req.user._id
  //  })
  //  cover.save(function(err){
  //    if(err){
  //     console.log(err)
  //      return res.send({error:err.message});
  //    }
  //   })
   // console.log('/in user sucessfully')
  
    coverPic.findOne({_userId:req.user._id}).select({'coverPhoto':1})
    .exec(function(err,photo){
      if(err){
        res.send({error:'Cannot proceed with the request'})
        return;
      }
      if(!photo){
        return;
      }
      if(photo){
        userstats.findOne({_userId:req.user._id},(err,stats)=>{
          if(err){
            console.log(err)
            res.send({message:true})
            return;
            }
            if(!stats){
              res.send({message:true})
              return;
            }
            let spec="";
         req.user.type=="teacher"?spec=req.user.spec1:spec=req.user.class    
        var user={
          full_name:req.user.firstName + " "+req.user.lastName,
          from:req.user.city+" - "+req.user.country,
          qualification:req.user.qualification,
          coverPhoto:photo,
          specialization:spec,
          moto:req.user.moto,
          photo:req.user.photo,
          emailAuth:req.user.emailAuth,
          approved:req.user.approved,
          myProfile:true,
          type:req.user.type,
          _id:req.user._id,
          friendsCount:req.user.friends.length,
          requestsCount:req.user.request.length
       
        };
        let users={
          user:user,
          auth:req.user.fileAuth,
        }
        res.send({user:users,stats:stats}) 
      })
      }
    })
 //   })
  }
  else{
    if(req.user.emailAuth && req.user.approved){
// var stats=new userstats({
//     _userId:req.user._id,
//     RemainingConnect:30,
//     connsume:0,
//     totalApplies:0,
//     offerRemaining:5,
//     tutionRemaining:10,
//     totalPosted:0
//   })
//   stats.save(function(err){
//     if(err){
//       console.log(err)
//     }
//   })
      User.findOne({$and:[{username:new RegExp('^'+terms+'$', "i")},{approved:true}]}).select({'createdAt':1,'firstName':1,'lastName':1,'spec1':1,'qualification':1,'moto':1,'photo':1,'institue':1,'teach':1,'_id':1,"city":1,"country":1,"type":1,'request':1})
      .exec(function(err,userss){
        if(err){
          res.send({error:'Could not proceed the request'})   
    
        }
      if(!userss){
          res.send({notFound:true})   
          return;
        }
      if(userss){
        coverPic.findOne({_userId:userss._id}).select({'coverPhoto':1})
        .exec(function(err,photo){
        if(err){
          console.log(err)
          res.send({error:'Cannot proceed with the request'})
          return;
        }
        if(!photo){
          console.log('Photo not found');
        }
        userstats.findOne({_userId:req.user._id},(err,stats)=>{
          if(err){
            console.log(err)
            res.send({message:true})
            return;
            }
            if(!stats){
              res.send({message:true})
              return;
          }
          
        let user={
        full_name:userss.firstName + " "+ userss.lastName,
        from:userss.city +"-"+userss.country,
        spec1:userss.spec1,
        moto:userss.moto,
        qualification:userss.qualification,
        teach:userss.teach,
        photo:userss.photo,
        type:userss.type,
        approved:req.user.approved,
        _id:userss._id, 
        request:userss.request.indexOf(req.user._id)==-1?false:true,
        friend:req.user.friends.indexOf(userss._id)==-1?false:true,  
        respond:req.user.request.indexOf(userss._id)==-1?false:true 
      };
     
        user.emailAuth=req.user.emailAuth;
        user.coverPhoto=photo;
        user.myProfile=false;
        user.email=req.user.email;
        let users={
          user:user,
          auth:req.user.fileAuth
        }
         res.send({user:users,stats:stats})
      })
    
    })
   }
  })

  } 
  else{
  
        res.send({emailAuth:false,otherProfile:true})
  }
}
})
router.post('/fecthNoti',ensureAuth, (req,res,next)=>{
  
  notifyDb.find({_userId:req.user._id}).sort({createdAt:-1}).populate({path:"othersId",model:"User",select:"photo firstName lastName"}).exec(function(err,notification){
  if(err){
    res.send({err:true})
    return;
  }
  if(!notification){
    res.send({message:true})
    return;
    }
    console.log(notification)
    res.send({notifications:notification})  
    return;  
  })
})
router.post('/updateStats',ensureAuth,(req,res,next)=>{

 
  userstats.findOne({_userId:req.user._id}).select({resetTime:1,offerRemaining:1,tutionRemaining:1,RemainingConnect:1,lastLogin:1}).exec(function(err,user){
    if(err){
      console.log(err)
      return;
    }
    var date =new Date().getMonth();
    var you =new Date(user.resetTime).getMonth();
    
    if(date!==you){
      if(req.user.type=="teacher"){
      user.offerRemaining=4      
      }
      else {
        user.tuitionRemaining=10
      }
        user.RemainingConnect=10;
        user.lastLogin=Date.now();
        user.save(next);
        }
  })
  return
})
router.post('/applyTuition',ensureAuth,(req,res,next)=>{
  console.log(req.body)
  if(req.user.approved){

    User.findOne({_id:req.body.userId}).select({request:1}).exec(function(err,user) {
      if(err){
        console.log(err)
        res.send({received:false})
        return;
    }
    if(!user){
      console.log('user not found')
    }
    
    if(user.request.indexOf(req.user._id)==-1){
    user.request.push(req.user._id)
    user.save(function(err){
      if(err){
          console.log(err)
          res.send({received:false})         
          return;
        }
      })
    }
    userstats.findOne({_userId:req.user._id}).select({"RemainingConnect":1,"connsume":1}).exec(function(err,stats){
      if(err){
        console.log(err)
        res.send({received:false})
        return;
      }
      if(!stats){
        res.send({received:false})
        return;
      }
      if(stats.RemainingConnect>0){
        posts.findOneAndUpdate({_id:req.body.pId},{$push:{applied:req.user._id}},(err)=>{
          if(err){
            console.log(err)
            res.send({received:false})
            return;
          }
          stats.RemainingConnect=stats.RemainingConnect-1;
          stats.connsume=stats.connsume+1
          stats.save(function(err){
            if(err){
              console.log(err);
              res.send({received:false})
              return;
            }
            res.send({received:true})
          })
        })
      }
      else{
        res.send({received:false,message:true})
      }
      })
    })
  }
})
  
router.get('/getUsernme',ensureAuth,(req,res,next)=>{
  res.send({data:{username:req.user.username,
    pic:req.user.photo,
    firstName:req.user.firstName}})
    console.log(req.user.firstName)
});


router.get('/getStats',ensureAuth,(req,res,next)=>{
  userstats.findOne({_userId:req.user._id}).select({"notifyCounter":1,messageCounter:1}).exec((err,stats)=>{
    if(err){
      console.log(err)
      res.send({message:true})
      return;
      }
      if(!stats){
        res.send({message:true})
        return;
      }
        res.send({stats:stats})
  })
});

router.get('/email_confirmation/asdjashdjkashasdioiqwuewoqunxhasdhsajdkasdhjksadjkhasdhjashdkjasdioiqwuewoqunxhashasjdhhsadjkshasjhasdioiqwuewoqunxh/*',ensureAuth,(req,res,next)=>{
  res.sendFile(path.resolve(__dirname, '../views', 'index.html'));  
});

router.post('/phoneAuth',ensureAuth,(req,res,next)=>{
   
    req.user.photo.data=fs.readFileSync(pathImg);
    req.user.phoneAuth=true;
    req.user.save(function(err){
      if(err){
        console.log(err)
        return res.send({error:err.message});
      }
      
   var coverPicture =new coverPic({
    "coverPhoto.data":fs.readFileSync(pathImg2),
    "coverPhoto.content":'Cover photo',
    _userId:req.user._id
   })
   coverPicture.save(function(err){
     if(err){
      console.log(err)
       res.send({error:'Could not proceed the request'});
       return
      }

      res.send({phonesaved:true})
      return;
   })  
  })
})
  router.get('/email_confirmation',ensureAuth, function (req, res, next) {
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
     
      User.findOne({ _id: token._userId }).select({"emailAuth":1}).exec(function (err, user) {
        if (!user) 
        { 
          res.send({danger:true})
          return;
      }
            if (user.emailAuth)
            { 
              res.send({verified:true,username:req.user.username});
              return;
            }
                    
        user.emailAuth = true;
        user.save(function (err) {
          if (err) { 
            res.send({danger: true}); 
            return;
        }
            res.send({success:true,username:req.user.username})
            return;
          });
        });
      });
  });
  

  router.post('/form',ensureAuth,function(req,res,next){
  req.user.qualification=req.body.qualification;
  req.user.institue=req.body.institute;
  req.user.spec1=req.body.spec1;
  req.user.country=req.body.country;
  req.user.postalCode=req.body.postalCode;
  req.user.dOb=req.body.startDate;
  req.user.ans1=req.body.ans1;
  req.user.school=req.body.school;
  req.user.ans2=req.body.ans2;
  req.user.ans3=req.body.ans3;
  req.user.study=req.body.study;
  req.user.cnic=req.body.cnic;
  req.user.teach=req.body.teach;
  req.user.hobby=req.body.hobby;
  req.user.moto=req.body.moto;
  req.user.area=req.body.area;
  req.user.city=req.body.city;
  req.user.type=req.body.type;
  req.user.houseNumber=req.body.houseNumber;
  req.user.gender=req.body.gender;
  req.user.subject=req.body.subject;
  req.user.class=req.body.class;
  req.user.percentage=req.body.percentage;
  req.user.form_filed=true
  req.user.save(function(err) {
    if (err) {
      res.send({error:'Could not proceed with the request'})
      return;
    }
    let offerRemaining=0,tuitionRemaining=0;
  if(req.user.type=="student"){
        offerRemaining=-1;   
        tuitionRemaining=10;  
  }
  else{
        
      offerRemaining=5;   
      tuitionRemaining=-1;  
    }
  
    var stats=new userstats({
      _userId:req.user._id,
      RemainingConnect:30,
      connsume:0,
      totalApplies:0,
      offerRemaining:offerRemaining,
      tutionRemaining:tuitionRemaining,
      totalPosted:0,
      room:req.user._id+"notifications"
    })
      stats.save(next);
      return res.json({proceed:true})
  
  })
});



router.get('/checkAuth',ensureAuth,(req,res,next)=>{
  res.send({user:{
    phoneAuth:req.user.phoneAuth,
    emailAuth:req.user.emailAuth,
    fileAuth:req.user.fileAuth,
    form_filed:req.user.form_filed,
    username:req.user.username
    }
    })
  })
router.post('/profile',ensureAuth,function(req,res,next){
    
  if(req.files==null){
      res.send({saved:true})
      return;
    }
    else{
      req.user.photo.data=req.files.myFile.data;
      }
    req.user.save(function(err){
    if(err){
      res.send({error:err.message})
      return;
    }
     res.send({saved:true})
      
  }); 
});


router.post('/changePassword',ensureAuth,function(req,res,next){
  User.findOne({username:req.user.username},function(err,user){
   var user2={};
   if(req.user.type=="student"){

    user2={
     hobby:req.user.hobby,
     phone:req.user.phone,
     email:req.user.email,
     moto:req.user.moto,
     percentage:req.user.percentage,
     class:req.user.class,
     subject:req.user.subject,
     learn:req.body.learn,
     type:'student'
   }
 } 
   if(req.user.type=="teacher"){
      user2={
       spec1:req.user.spec1,
       hobby:req.user.hobby,
       school:req.user.school,
       email:req.user.email,
       phone:req.user.phone,
       moto:req.user.moto,
       teach:req.user.teach,
       subject:req.user.subject,
       study:req.user.study,
       learn:req.user.learn,
       type:"teacher"
     }  
   } 
    if(err) {
      return res.send({message:err.message,user:user2});
    }
    user.checkPassword(req.body.password,function(err,isMatch){
    
      if(err){

            return res.send({user:user2,message:'Error with proceeding your request'});
        }
        if(!isMatch){
            return res.send({user:user2,message:'You have entered wrong password'})
        }
        req.user.password=req.body.newPassword
        req.user.save(function(err){
          if(err){

            return res.send({user:user2,message:err.message})
          }
         res.send({user:user2,savedSetting:true})
        }) 
      })
  });
});


router.get('/viewSetting',ensureAuth,function(req,res,next){
  if(req.user.type=="student"){

    var user={
      hobby:req.user.hobby,
      phone:req.user.phone,
      email:req.user.email,
      moto:req.user.moto,
      percentage:req.user.percentage,
      class:req.user.class,
      subject:req.user.subject,
      learn:req.body.learn,
      type:'student'
    }  
  }
  else{
    var user={
      spec1:req.user.spec1,
      hobby:req.user.hobby,
      school:req.user.school,
      email:req.user.email,
      phone:req.user.phone,
      moto:req.user.moto,
      teach:req.user.teach,
      subject:req.user.subject,
      study:req.user.study,
      learn:req.user.learn,
      type:"teacher"
    }  
  }
  userstats.findOne({_userId:req.user._id}).select({"notifyCounter":1,"messageCounter":1}).exec(function(err,stats){
      if(err){
        res.send({message:'Could not proceed with the request'}) 
        return;
      }
    
        res.send({user:user,stats:stats})

  })
});


router.post('/DoSearch',ensureAuth,function(req,res,next){
  let search=arrayWrap(req.body.value ||" ");
  let terms= search[0].split(" ")
  let area="",city='',gender="";
  console.log(req.body)
  if(req.body.area!=""){
    area=req.body.area
     //area= search2[0].split(" ")
  }
  if(req.body.city!=""){
    city=req.body.city
  }
  if(req.body.city!=""){
   gender=req.body.gender
  }
  if(req.user.type=='student'){

    posts.find({$and:[{category:{$in: new RegExp('^'+terms+'$', "i")}},{type:'offer'},{city:{ $regex:'.*'+city+'.*'}},{favoriteArea:{ $regex:'.*'+area+'.*'}}]}).select({'date':1,'offerContent':1,'city':1,'category':1}).limit(10).exec(function(err,user){
      if(err) {
        console.log(err)
      return res.send({messag:err.message})}
      console.log(user)  
      res.send({posts:user})

      });
    }
    else{
      posts.find({$and:[{category:{$in:new RegExp('^'+terms, "i")}},{type:'tuition'},{city:{ $regex:'.*'+city+'.*'}},{area:{ $regex:'.*'+area+'.*'}},{studentGender:{ $regex:'.*'+gender+'.*'}}]}).select({"date":1,'category':1,'class':1,'city':1}).sort({date:-1}).limit(10).exec(function(err,post){
        if(err){
          console.log(err)
          res.send({error:'Could not proceed the request'})
          return;
        }
        if(!post){
          res.send({message:'No new post'})
          return;
        }
          res.send({posts:post})
      
        })

    }
})


router.post('/postSettings',ensureAuth,function(req,res,next){

  User.findOne({username:req.user.username},function(err,user){
    if(err) {return res.send({message:err.message});}
    user.checkPassword(req.body.password,function(err,isMatch){
      var user={}
      if(req.user.type=="student"){

         user={
          hobby:req.user.hobby,
          phone:req.user.phone,
          email:req.user.email,
          moto:req.user.moto,
          percentage:req.user.percentage,
          class:req.user.class,
          subject:req.user.subject,
          learn:req.body.learn,
          type:'student'
        }
      } 
        if(req.user.type=="teacher"){
           user={
            spec1:req.user.spec1,
            hobby:req.user.hobby,
            school:req.user.school,
            email:req.user.email,
            phone:req.user.phone,
            moto:req.user.moto,
            teach:req.user.teach,
            subject:req.user.subject,
            study:req.user.study,
            learn:req.user.learn,
            type:"teacher"
          }  
        }
        if(err){
            return res.send({message:'Error with proceeding your request',
            user:user});
        }
        if(!isMatch){
              return res.send({message:'You have entered wrong password',user:user})
                     }
        req.user.spec1=req.body.spec1;
        req.user.hobby=req.body.hobby;
        req.user.moto=req.body.moto;
        req.user.teach=req.body.teach;
        req.user.subject=req.body.subject;
        req.user.school=req.body.school;
        req.user.save(function(err){
          if(err){
            res.send({error:err.message})
          }
          if(req.user.type=="student"){

            user={
              hobby:req.user.hobby,
              phone:req.user.phone,
              email:req.user.email,
              moto:req.user.moto,
              percentage:req.user.percentage,
              class:req.user.class,
              subject:req.user.subject,
              learn:req.body.learn,
              type:'student'
            }  
          }
          if(req.user.type=="teacher"){
               user={
              spec1:req.user.spec1,
              hobby:req.user.hobby,
              school:req.user.school,
              email:req.user.email,
              phone:req.user.phone,
              moto:req.user.moto,
              teach:req.user.teach,
              subject:req.user.subject,
              study:req.user.study,
              learn:req.user.learn,
              type:"teacher"
            }  
            res.send({user:user,savedSetting:true})
          }
        })
        
   
        })
    })
  }) 
  
  
router.post('/changeEmail',ensureAuth,function(req,res,next){
    var user2={}
        if(req.user.type=="student"){
  
           user2={
            hobby:req.user.hobby,
            phone:req.user.phone,
            email:req.user.email,
            moto:req.user.moto,
            percentage:req.user.percentage,
            class:req.user.class,
            subject:req.user.subject,
            learn:req.body.learn,
            type:'student'
          }
        } 
          if(req.user.type=="teacher"){
             user2={
              spec1:req.user.spec1,
              hobby:req.user.hobby,
              school:req.user.school,
              email:req.user.email,
              phone:req.user.phone,
              moto:req.user.moto,
              teach:req.user.teach,
              subject:req.user.subject,
              study:req.user.study,
              learn:req.user.learn,
              type:"teacher"
            }  
          }
    User.findOne({username:req.user.username},function(err,user){
      if(err) {
        return res.send({message:err.message,user:user2});
      }
   
    user.checkPassword(req.body.password,function(err,isMatch){
      if(err){
          return res.send({message:'Error with proceeding your request',user:user2});
      }
      if(!isMatch){
          return res.send({message:'You have entered wrong password',user:user2})
      }
          
        var token = new Token({
          _userId: req.user._id,
          token: crypto.randomBytes(16).toString('hex')
        });
        token.save(next);
      
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
                  to: 'shoaibnoor95@hotmail.com',
                  subject: 'Tutons account confirmation',
                  html: data
                };
                
                client.sendMail(email, function(err, info){
                  if (err){
                    return res.send({message:err.message,user:user2})
                  }
                  if(info){
                    req.user.emailAuth=false;
                    req.user.changeEmail=req.user.email;
                    req.user.email=req.body.newEmail;
                    req.user.save(next);
                    
                  }
                });
              }
            });
            
            res.send({message:'Confirmation email has been sent check your email',user:user2,savedSetting:true})
          }); 
    });
  });


// router.post('/tutorns_statistics',ensureAuth,(req,res,next)=>{
//   stats.find({$and:[{month:req.body.month},{_userId:req.user._id}]}).select({"createdAt":1,"with":1,"transact":1,"topic":1}).count().sort({createdAt:'ascending'}).exec(function(err,records){ 
//     if(err){
//         return err;
//     }
//     if(user){
// ejs.renderFile(__dirname+ '/template/receipt.ejs',{records:records,
//     users:{
//       name:req.user.first_name+" "+req.user.last_name,
//       email:req.user.email,
//       month:req.body.month}},(err,data)=>{
//              if(err){
//                   return res.send({message:err.message});
//         }
//         var options = {
//             format: "A4",
//             orientation: "portrait",
//             border: "10mm"
//         };
//         var document = {
//             template: data,
//             context: {
//                 options:{}
//                     },
//             path: "./reports/"+req.user._id+".pdf"
//         };
//         pdf.create(document, options)
//         .then(resp => {
//             console.log(resp);
//             res.sendFile(path.resolve(__dirname,'reports',req.user._id+'.pdf'))
//         })
//         .catch(error => {
//             console.error(error)
//         });
//      })
//     }    
//   })
// });
// router.get('/tutorns_statistics',ensureAuth,(req,res,next)=>{
//   res.sendFile(path.resolve(__dirname,'reports',req.user._id+'.pdf'));
// });


router.post('/makeRequest',(req,res,next)=>{
  if(req.user.approved){

    var person=req.body.person;
 
  User.findOneAndUpdate({_id:person},{$push:{request:req.user._id}},(err)=>{
      if(err){
        return res.send({message:err.message})
      }
        return res.send({ok:true})    
    })
  }
  });

  router.post('/removeRequest',(req,res,next)=>{
    var person=req.body._id;
    User.findOneAndUpdate({_id:req.user._id},{$pull:{request:person}},(err)=>{
        if(err){
          return res.send({ok:false})
        }
          res.send({ok:true})    
      });
  });
router.post('/cancleRequest',(req,res,next)=>{
    var person=req.body._id;
    User.findOneAndUpdate({_id:person},{$pull:{request:req.user._id}},(err)=>{
        if(err){
          return res.send({ok:false})
        }
          return res.send({ok:true})    
      });
  });
  
  router.post('/availablityChanger',ensureAuth,(req,res,next)=>{
    userstats.findOneAndUpdate({_userId:req.user._id},{availablity:req.body.available},function(err){
        if(err){
          console.log(err);
          res.send({success:false})
          return;
        }
        
          res.send({success:true})
    })
  })
  
// router.post('/deleteRequest',(req,res,next)=>{
//     var person=req.query.user;
//     User.findOneAndUpdate({_id:person},{$pull:{request:req.user._id}},(err)=>{
//         if(err){
//           return res.send({message:err.message})
//           }
//           return res.send({cancle:true})    
//   });
// });


// router.get('/viewRequest',ensureAuth,(req,res,next)=>{
//   User.findOne({_id:req.user._id},'request',(err,request)=>{
//     if(err){
//       return res.send({errror:err.message});
//     }
//     if(!request){
//       return res.send({message:'No Request'})
//     }
//     User.find({_id:{$in:request}}).select({"photo":1,"first_name":1,"last_name":1,"username":1,"_id":1}).exec(function(err,data){
//       if(err){
//         return res.send({error:err.message})
//       }
//       if(!data){
//         return res.send({message:'no user has that username'});
//       }
//         return res.send({request:data});
//     })
//   })
// })

// router.post('/viewfriends',ensureAuth,(req,res,next)=>{
//   User.findOne({_id:req.user._id},'friends',(err,friends)=>{
//     if(err){
//       return res.send({errror:err.message});
//     }
//     if(!friends){
//       return res.send({message:'No Friends'})
//     }
//     User.find({_id:{$in:friends}}).select({"photo":1,"first_name":1,"last_name":1,"username":1,"_id":1}).exec(function(err,data){
//       if(err){
//         return res.send({error:err.message})
//       }
//       if(!data){
//         return res.send({message:'No friend on this url found'});
//       }
//         return res.send({friends:data});
//     });
//   });
// });

// router.post('/viewfriends',ensureAuth,(req,res,next)=>{
//   User.findOne({_id:req.user._id},'friends',(err,friends)=>{
//     if(err){
//       return res.send({errror:err.message});
//     }
//     if(!friends){
//       return res.send({message:'No Friends'})
//     }
//     User.find({_id:{$in:friends}}).select({"photo":1,"first_name":1,"last_name":1,"username":1,"_id":1}).exec(function(err,data){
//       if(err){
//         return res.send({error:err.message})
//       }
//       if(!data){
//         return res.send({message:'No friend on this url found'});
//       }
//         return res.send({friends:data});
//     });
//   });
// });
router.post('/cover',ensureAuth,(req,res,next)=>{
  coverPic.findOneAndUpdate({_userId:req.user._id},{"coverPhoto.data":req.files.myFile.data},function(err){
    if(err){
      res.send({error:err.message})
      return;
    }
       res.send({saved:true})
  })
})
router.post('/updatePost',ensureAuth,(req,res,next)=>{
  console.log(req.body)
  if(req.user.type==="student"){
    posts.findOneAndUpdate({_id:req.body.pId},{
      "teacherSpecification":req.body.teacherSpecification,
      "class":req.body.class,
      "area":req.body.area,
      "city":req.body.city,
      "category[0]":req.body.category[0],
      "category[1]":req.body.category[1],
      "category[2]":req.body.category[2],
      "studentGender":req.body.studentGender
    },function(err){
      if(err){
        res.send({error:err.message})
        return;
      }
      posts.find({_userId:req.user._id},function(err,posts)
      {
        if(err)
        {
          res.send({error:err.message})
          return;
        }
        res.send({updatePost:true,posts:posts})

      })

    })
  }
  else{
    posts.findOneAndUpdate({_id:req.body.pId},{
      "city":req.body.city,
      "favoriteArea":req.body.favoriteArea,
      "offerContent":req.body.offerContent,
      "city":req.body.city,
      "category[0]":req.body.category[0],
      "category[1]":req.body.category[1],
      "category[2]":req.body.category[2],
     },function(err){
      if(err){
        res.send({error:err.message})
        return;
      }
      posts.find({_userId:req.user._id},function(err,posts)
      {
        if(err)
        {
          res.send({error:err.message})
          return;
        }
        res.send({updatePost:true,posts:posts})

      })

    })

  }
})
router.post('/unApply',ensureAuth,(req,res,next)=>{
  posts.findOneAndUpdate({_id:req.body.pId},{$pull:{applied:req.user._id}},(err)=>{
    if(err){
      res.send({error:err.message})
      return;
        }
      res.send({received:true})
    })
})

router.get('/info',ensureAuth,(req,res,next)=>{
  console.log(req.query)
  if(req.query.id==req.user._id){
 if(req.user.type=="teacher"){
  let user={
   from: req.user.city +" - "+req.user.country,
   gender:req.user.gender,
   favoriteSubjet:req.user.subject,
   spec1:req.user.spec1,
   moto:req.user.moto,
   institute:req.user.institue,
   teach:req.user.teach,
   hobby:req.user.hobby,
   school:req.user.school,
   study:req.user.study,
   qualification:req.user.qualification,
  }
    res.send({user:user})
    return; 
}
else{
  let user={
    from: req.user.city +" - "+req.user.country,
    gender:req.user.gender,
    favoriteSubjet:req.user.subject,
    spec1:req.user.spec1,
    moto:req.user.moto,
    institute:req.user.institue,
    teach:req.user.teach,
    hobby:req.user.hobby,
    school:req.user.school,
    learn:req.user.learn,
    percentage:req.user.percentage,
    class:req.user.class
    }
     res.send({user:user})
  }
}
  else{
    User.findOne({_id:req.query.id}).select({"city":1,"country":1,"subject":1,"city":1,"spec1":1,"moto":1,"institue":1,"hobby":1,"study":1,"qualification":1,"learn":1,"percentage":1,"class":1,"teach":1}).exec(function(err,user){
    if(err){
      res.send({message:true})
      return;
    }
    console.log(user)
    if(req.query.type=="teacher"){
     let users={
     from: user.city +" - "+user.country,
     gender:user.gender,
     favoriteSubjet:user.subject,
     spec1:user.spec1,
     moto:user.moto,
     institute:user.institue,
     teach:user.teach,
     hobby:user.hobby,
     school:user.school,
     study:user.study,
     qualification:user.qualification,
     teach:user.teach
    }
      res.send({user:users})
      return;
  }
  else{
    let users={
      from: user.city +" - "+user.country,
      gender:user.gender,
      favoriteSubjet:user.subject,
      spec1:user.spec1,
      moto:user.moto,
      institute:user.institue,
      teach:user.teach,
      hobby:user.hobby,
      school:user.school,
      learn:user.learn,
      percentage:user.percentage,
      class:user.class
      }
       res.send({user:users}) 
      }
     })
    }
})

router.post('/deletePost',ensureAuth,(req,res,next)=>{
  posts.findOneAndRemove({_id:req.body.pId},function(err){
    if(err){
      res.send({error:err.message})
      return;
    }
    posts.find({_userId:req.user._id},function(err,posts){
      if(err){
        res.send({error:err.message})
        return 
      } 
      res.send({deletePost:true})
    })
  })
})


router.post('/addfriend',ensureAuth,(req,res,next)=>{
  let newList=req.user.friends;
  newList.push(req.body._id);
    req.user.friends=newList;
    req.user.request=req.user.request.pull(req.body._id)
    req.user.save(function(err){
      if(err){
        console.log(err)
             return res.send({ok:false});
      }
      
      User.findByIdAndUpdate(req.body._id,{$push:{friends:req.user._id},$pull:{request:req.user._id}}).exec(function(err){
        if(err){
          res.send({message:true})
          return;
        }  
          res.send({ok:true})
      })
    })
  });


router.post('/removeFriend',ensureAuth,(req,res,next)=>{
  req.user.friends=req.user.friends.push(req.body._id)
  req.user.request=req.user.request.pull(req.body._id)
  req.user.save(function(err){
    if(err){
      return res.send({ok:false});
    }
    User.findByIdAndUpdate(req.body._id,{$pull:{friends:req.user._id}}).exec(function(err){
      if(err){
        res.send({ok:false})
        return;
      }
      res.send({ok:true})
      })
    });
  });


router.get('/getPhone',ensureAuth,(req,res,next)=>{
  res.send({phone:req.user.phone_Number})
});
router.post('/changePhone',ensureAuth,(req,res,next)=>{
  User.findOne({username:req.user.username},function(err,user){
    if(err) {return res.send({message:err.message});}
    user.checkPassword(req.body.password,function(err,isMatch){
        if(err){
            return res.send({message:'Error with proceeding your request'});
        }
        if(!isMatch){
            return res.send({message:'You have entered wrong password'})
        }
          req.user.changePhone=req.body.oldPhone;
          req.user.phone_Number=req.body.newPhone;
          req.user.save(function(err){
            if(err){
              res.send({error:err.message})
            }
              res.send({phoneSaved:true})
          })
        

  })
  })
});
// router.get('/showStats',(req,res,next)=>{
// userstats.findOne({_userId:req.user._id}).select({"RemainingConnect"})
//});
router.get('/onSearch',ensureAuth,(req,res,next)=>{
  // console.log(req.user.type)
  if(req.user.type=='teacher'){
    
      posts.find({$and:[{category:{$in:req.user.teach}},{type:'tuition'}]}).select({"city":1,'category':1,'date':1,"class":1}).sort({date:-1}).exec(function(err,post){
      if(err){
        console.log(err)
        res.send({error:'Could not proceed the request'})
        return;
      }
      if(!post){
        res.send({message:'No new post'})
        return;
      }
      console.log(post)
      userstats.findOne({_userId:req.user._id}).select({"notifyCounter":1,"messageCounter":1,"RemainingConnect":1,"offerRemaining":1}).exec(function(err,stats){
        if(err){
          res.send({error:'Could not proceed with the request'})
          return;
        }
        if(!stats){
          console.log('stats not found')
          return;
        }
          console.log(stats)
          res.send({posts:post,stats:stats,id:req.user._id})
      })
    })
  }
  else{
        posts.find({type:'offer'}).select({"date":1,'category':1,"city":1,'offerContent':1}).sort({date:-1}).limit(10).exec(function(err,post){
        if(err){
        console.log(err)
        res.send({error:'Could not proceed the request'})
        return;
      }
       if(!post){
        res.send({message:'No new post'}) 
        return;
      }
      userstats.findOne({_userId:req.user._id}).select({"notifyCounter":1,"messageCounter":1,"RemainingConnect":1,"tutionRemaining":1}).exec(function(err,stats){
        if(err){
          res.send({error:'Could not proceed with the request'})
          return;
        }
        res.send({posts:post,stats:stats,id:req.user._id})
        })
      })
  }
})
router.get('/selfPosts',ensureAuth,function(req,res,next){
  var search=arrayWrap(req.query.userId ||" ");
  var terms= search[0].split(" ")
  
  User.findOne({username:terms}).select({"_id":1}).exec(function(err,id){
    if(err){
      res.send({error:'Could not proceed the request'})
      return;
    }
    if(!id){
      res.send({message:'No tuition or offer to show'})
      return;
    }
    posts.find({_userId:id._id}).sort({date:-1}).exec(function(err,posts){
      if(err){
        res.send({error:err.message})
        return;
      }
      if(!posts){
        res.send({message:'No tuition or offer to show'})
        return;
      }
      if(posts){
        res.send({posts:posts,id:req.user._id})
      }
    })
  })
})
router.get('/postSingle',ensureAuth,(req,res,next)=>{
  var search=arrayWrap(req.query.search ||"");
  var terms= search[0].split(" ")
  posts.findOne({"_id":terms},function(err,posts){
    if(err){
      console.log(err)
      res.send({error:'Could not proceed with the request'})
      return;
    }
    if(!posts){
      res.send({message:true})
    
      return;
    }
    
   User.findOne({"_id": posts._userId}).select({"photo":1,"firstName":1,"lastName":1,"username":1}).exec(function(err,user){
    if(err){
      console.log(err)
      res.send({error:'Could not proceed with the request'})   
      return;
    }
    userstats.findOne({_userId:req.user._id},(err,stats)=>{
      if(err){
        console.log(err)
        res.send({message:true})
        return;
        }
        if(!stats){
          console.log('stats not found')
          res.send({message:true})
          return;
      }
    var myProfile=false;
     if(posts._userId.toString()==req.user._id.toString())myProfile=true
   
       res.send({post:posts,user:user,myProfile:myProfile,stats:stats})
    })
  
  })
})
})

router.post('/singlePosting',ensureAuth,(req,res,next)=>{
  var search=arrayWrap(req.body.identity ||"");
  var terms= search[0].split(" ")
  console.log(terms[0])
    posts.findOne({"_id":terms}).select({"area":1,'requiredTeacherSpecification':1,"favoriteArea":1,"invited":1,"applied":1,"views":1,"_userId":1,"studentGender":1}).exec(function(err,posts){
    if(err){
      res.send({error:'Could not proceed with the request'})
      return;
    }
    if(!posts){
      console.log('post not found')
      res.send({message:true})
      return;
    }
    posts.views+=1;
    posts.save(function(err){
      if(err){
        console.log('error in saving')
        res.send({message:true})
        return;
      }
    
   User.findOne({_id:posts._userId}).select({"photo":1,"firstName":1,"lastName":1,"username":1}).exec(function(err,user){
    if(err){
      res.send({error:'Could not proceed with the request'})   
      return;
    }
     res.send({post:posts,user:user})
     return;   
      
      })
    })
  })
})

router.post('/appliedCandidates',ensureAuth,(req,res,next)=>{
  var ide=req.body.pId;
  posts.findOne({_id:ide}).select({applied:1}).exec(function(err,applied){
    if(err){
      res.send({error:'Could not proceed the request'})
      return;
      }
      User.find({_id:applied.applied}).select({"photo":1,"firstName":1,"lastName":1,"username":1})
      .exec(function(err,candidates){
        if(err){
          res.send({error:'Could not proceed the request'})
          return;
        }
          res.send({candidates:candidates})
        })
    })
})

// router.get('/posts/*',ensureAuth,(req,res,next)=>{
//   res.sendFile(path.resolve(__dirname, '../views', 'index.html')); 
// })


router.get('/phone',ensureAuth,(req,res,next)=>{
  res.sendFile(path.resolve(__dirname, '../views', 'index.html'));
}); 

router.get('/*',ensureAuth,(req,res,next)=>{
   res.sendFile(path.resolve(__dirname, '../views', 'index.html'));
});
module.exports=router;  