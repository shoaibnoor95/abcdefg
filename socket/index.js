'use strict';
var redis=require('redis').createClient;
var adapter=require('socket.io-redis');
var config=require('../config');
var fs=require('fs');
var messageRoom=require('../models/rooms');
var messages=require('../models/messaging');
var User =require('../models/User');
var notificationDb=require('../models/notifications');
var userstats=require('../models/userstats');
var posts=require('../models/post')
var ioEvents=function(io){
    
    io.of('/notifications').on('connection',function(socket){
    
        if(socket.request.session.passport==null){
            return;
        }
        let room=""; 
        userstats.findOne({_userId:socket.request.session.passport.user}).select({"room":1})
        .exec(function(err,rooms){
        
            if(rooms){

             room=rooms.room
             socket.join(room)
            }
        })
          
        socket.on('applyTuitions',(details)=>{
            if(socket.request.session.passport==null){
                return;
            }

                var notify=new notificationDb({
                    _userId:details.userId,
                    notLink:"/posts/"+details.id,
                    othersId:socket.request.session.passport.user,
                    text:"I am interested in your tuition/offer",
                })
                notify.save(function(err){
                    if (err){
                        return;
                }
                userstats.findOne({_userId:details.userId}).select({"room":1,"notifyCounter":1}).exec(function(err,notifier){
                    if(err){
                        return;
                    }
                        console.log(notifier);
                        notifier.notifyCounter+=1;
                        notifier.save(function(err){
                        if(err){
                            return;
                        }
                        socket.to(notifier.room).emit("notifyMe",notify);                   

                              })    
                   })
                })
            })
            socket.on("okNoti",function(){
                userstats.findOneAndUpdate({_userId:socket.request.session.passport.user},{notifyCounter:0},function(err){
                    if(err) return;
                })
            })
            socket.on("acceptInvite",function(details){
                if(socket.request.session.passport==null){
                    return;
                }
            User.findById(socket.request.session.passport.user).select({"username":1,"firstName":1,lastName:1}).exec(function(err,user){
                if(err){          
                        return;
                    }
                    if(!user){
                        return;
                     }
                    console.log(user)
                     console.log(details)
                    var notify=new notificationDb({
                        _userId:details.id,
                        othersId:socket.request.session.passport.user,
                        notLink:"/"+user.username,
                        text:user.firstName+" "+user.lastName+ "has accepted your invitation",
                    })
                    notify.save(function(err){
                        if (err){
                            return;
                            }
                    let roomFound=false    
                     messageRoom.findOne({_userId:{$all:[socket.request.session.passport.user,details.id]}}).exec(function(err,rooms){
                           if(err){
                           return;
                       }
                       if(!rooms){
       
                        var newRoom=new messageRoom({
                               _userId:[socket.request.session.passport.user,details.id]
                        })
                        newRoom.save(function(err){
                            if(err){
                                console.log(err)
                                return;
                                }
                            })
                            roomFound=true;           
                        }

                        if(roomFound){
                            userstats.findOneAndUpdate({_userId:socket.request.session.passport.user},{$push:{mRoom:newRoom._id},$inc:{messageCounter:1}},function(err){
                                if(err){
                                    return;
                                }
                            })
                            
                        }    
                            
                        userstats.findOne({_userId:details.id}).select({"room":1,"notifyCounter":1,"messageCounter":1,"mRoom":1}).exec(function(err,notifier){
                        if(err){
                            return;
                        }
                        notifier.messageCounter+=1;
                        notifier.notifyCounter+=1;
                        if(roomFound){

                            notifier.mRoom.push(newRoom._id)
                        }
                        
                        notifier.save(function(err){
                            if(err){
                                return;
                            }
                            if(roomFound){
              
                                var message=new messages({
                                    _userId:require('mongoose').Schema.Types.ObjectId("admin123"), 
                                    roomId:newRoom._id,
                                    message:'Only you two are connected in this room'   
                                    })
                                    message.save(function(err){
                                        if(err){
                                            console.log(err)
                                            return;
                                        }
                                        
                                        socket.broadcast.to(newRoom._id).emit('firstMessage',{message:true})
                                    }) 
                            }
                                        socket.to(notifier.room).emit("notifyMe",notify)
                                     })
                                })    
                            })
                         })
                     })
                 })
            socket.on('makeRequest',function(notifyDetails){
            if(socket.request.session.passport==null){
                return;
            }
            User.findById(socket.request.session.passport.user).select({"username":1,"firstName":1,"lastName":1}).exec(function(err,user){
                if(err){
                    return;
                }
                if(!user){
                    return;
                }
                var notify=new notificationDb({
                    _userId:notifyDetails.id,
                    othersId:socket.request.session.passport.user,
                    notLink:"/"+user.username,
                    text:user.firstName+" "+user.lastName +" has sent you an invitation",
                })
                notify.save(function(err){
                    if (err){
                        return;
                }
                userstats.findOne({_userId:notifyDetails.id}).select({"room":1,"notifyCounter":1}).exec(function(err,notifier){
                    if(err){
                        return;
                    }
                    notifier.notifyCounter+=1;
                    notifier.save(function(err){
                        if(err){
                            return;
                        }
                        
                        socket.to(notifier.room).emit("notifyMe",notify)
                            })               
                         })
                     })
                })
            })
                socket.on('clearMessanger',function(){
                userstats.findOneAndUpdate({_userId:socket.request.session.passport.user},{messageCounter:0},function(err){
                      if(err){
                          return
                      }  
                    })
                })
                // socket.on('seenMessage',function (Id){
                //     messages.findById(Id,{seen:true,seenDate:Date.now()},function(err){
                //         if(err){
                //             console.log(err)
                //             return;
                //         }

                //     })
                // })

    socket.on('disconnect',function(){
        socket.leave(room)
        })
    })
    io.of('/messanger').on('connection',function(socket){

        if(socket.request.session.passport==null){
            return;
        }
        let msgRoom=[];
         userstats.findOne({_userId:socket.request.session.passport.user}).select({"mRoom":1,"onLine":1}).exec(function(err,mRooms){
            if(err){
                return;
            }
                if(mRooms){
                    msgRoom=mRooms.mRoom;
                    socket.join(msgRoom);
                    
                     mRooms.onLine=true;
                     mRooms.save(function(err){
                        if(err){
                            console.log(err)
                            return;
                        }
                    })
                }
            })
            socket.on('calling',(data)=>{
                //socket.to(room).emit('create');
                socket.to(data.room).emit('callee',{pic:data.pic,firstName:data.firstName,room:data.room})
            })
            // socket.on('receiving',(room)=>{
            //     socket.to(room).emit('join');
            // })
    //         socket.on('auth', data => {
    //             data.sid = socket.id;
    //             // sending to all clients in the room (channel) except sender
    //             socket.broadcast.to(data.room).emit('approve', data);
    //           });
    //           socket.on('accept', id => {
    //   //          io.sockets.connected[id].join(room);
    //             // sending to all clients in 'game' room(channel), include sender
    //             io.in(data.room).emit('bridge');
    //           });
    //           socket.on('reject', (room) => socket.broadcast.to(room).emit('full'));
    //           socket.on('leave', (room) => {
    //             // sending to all clients in the room (channel) except sender
    //             socket.broadcast.to(room).emit('hangup');
    //             });
            
        socket.on('getMyMsgg',function(){
      
            messages.aggregate(
                [
                    { $sort: { createdAt: 1} },
                    
                    {$match:{roomId:{$in:msgRoom}}},
                  {
                    $group:
                      {
                        userId:{$last:"$_userId"},
                        message:{$last:"$message"},
                        _id: "$roomId",
                        lastMessageDate: { $last: "$createdAt" }                      
                    }

                  },
                  
                ]
             ,function(err,docs){
                 if(err){
                     console.log(err);
                     return;
                 }
                 console.log(docs)
                 messageRoom.find({_id:msgRoom}).select({"_userId":1})
                .exec(function(err,room){
                    if(err){
                        console.log(err)
                    return  
                }
         
                let ar=[],ar2=[];
             room.map((el,i)=>{
                el._userId.map((gl,j)=>{
                    if(gl!=socket.request.session.passport.user){
                        ar.push(gl)
                        ar2.unshift(el._id)
                    }
                })
            })
                 User.find({_id:ar}).select({"photo":1,"firstName":1,"lastName":1}).exec(function(err,user){
                    if(err){
                        console.log(err)
                        return;
                    }
                    if(!user){
                    socket.emit("userDetails",{noDetails:true})        
                    return;
                    }
                     let users=[];
                    user.map(ob=>{
                            let index=ar.indexOf(ob._id+"")
                            users.splice(index,0,ob)
                        })
                            users=users.reverse();
                   //         let doc=docs.reverse()
                        
                        socket.emit("userDetails",users,ar2,ar,docs,socket.request.session.passport.user)
                     })    
                 })
             })
        })

            socket.on('addition',function(addition){
                User.findById(socket.request.session.passport.user).select({friends:1,request:1}).exec(function(err,user){
                if(err){
                    return;
                }
                if(user.friends.indexOf(addition.id)==-1){
                 user.friends.push(addition.id)
                 user.request.pull(addition.id)
                 user.save(function(err){
                        if(err){
                            return;
                        }

                    })
                User.findByIdAndUpdate(addition.id,{$push:{friends:socket.request.session.passport.user}},function(err){
                    if(err){
                        console.log(err)
                        console.log('here2')
                        return;
                    }
                }) 
                }
                 posts.findByIdAndUpdate(addition.postId,{$push:{invited:addition.id}},function(err){
                    if(err){
                        return;        
                    }
                 messageRoom.findOne({_userId:{$all:[socket.request.session.passport.user,addition.id]}},function(err,room){
                        if(err){
                            return;
                            }
                            if(!room){
                                let mRoom =new messageRoom({
                                    _userId:[socket.request.session.passport.user,addition.id],
                                })
                                mRoom.save(function(err){
                                    if(err){
                                        return;
                                    }
                                    let msg=new messages({
                                        roomId:mRoom._id,
                                        _userId:socket.request.session.passport.user,
                                        message:'Assalam-o-Alaikum i want to coordinate with you regarding this post. https://localhost:3000/posts/'+addition.postId+"\n"+"Kindly respond when available",                   
                                    })
                                    msg.save(function(err){
                                        if(err){
                                            console.log(err);
                                            return;
                                        }
                                   
                                userstats.findOneAndUpdate({_userId:addition.id},{$inc:{messageCounter:1},$push:{mRoom:mRoom._id}},function(err){
                                    if(err){
                                        return;
                                        }
                                    
                                userstats.findOneAndUpdate({_userId:socket.request.session.passport.user},{$inc:{messageCounter:1},$push:{mRoom:mRoom._id}},function(err){
                                    if(err){
                                        return;
                                        }
                                    })
                                })
                            })
                        })
                                }
                            if(room){
                                let msg=new messages({
                                    roomId:room._id,
                                    _userId:socket.request.session.passport.user,
                                    message:'Assalam-o-Alaikum i want to coordinate with you regarding this post. https://localhost:3000/posts/'+addition.postId+" Kindly respond when available",                   
                                })
                                msg.save(function(err){
                                    if(err){
                                        return;
                                    }
                                    let ar=[addition.id,socket.request.session.passport.user]
                                    userstats.updateMany({_userId:ar},{$inc:{messageCounter:1}},function(err){
                                     if(err){
                                       return;
                                         }
                                         socket.to(addition.id+"notifications").emit('notifyMessage')                  
                                         socket.to(socket.request.session.passport.user+"notifications").emit('notifyMessage')
                                        })  
                                })
                            }
                    })
                  })  
                })
            })
           socket.on("getMyConvo",function(msgs){

            if(socket.request.session.passport==null){
                return;
            }
            messages.find({roomId:msgs.room}).sort({createdAt:1}).exec((err,message)=>{
            if(err){    
                return; 
            }
            userstats.findOne({_userId:msgs.otherId}).select({"onLine":1,"lastLogin":1}).exec(function(err,stats){
               if(err){
                   console.log(err);
                   return; 
               }
                if(stats.onLine){
                    socket.emit("giveMyConvo",{message:message,onLine:true});
                }
                else{
                    socket.emit("giveMyConvo",{message:message,lastLogin:stats.lastLogin});                    
                    }
            })    
            })
        })
  


        socket.on('addMessage',function(msg){
            if(socket.request.session.passport==null){
                return;
            }
            else{
         
                var message=new messages({
                _userId:msg.id, 
                roomId:msg.roomId,
                message:msg.text   
                })
                message.save(function(err){
                if(err){
                socket.to(msg.roomId).emit("errSendMsg")
                return;  
                }
                socket.broadcast.to(msg.roomId).emit('newMessage',message)
                userstats.findOne({_userId:msg.otherId}).select({messageCounter:1,onLine:1}).exec(function(err,stats){
                   if(err){
                       return;
                   } 
                   if(!stats){
                       return;
           
                    }
               
                    if(stats.onLine){
                      socket.to(msg.roomId).emit('notifyMessage')
                    }
                  else{
                    
                       stats.messageCounter+=1
                       stats.save(function(err){
                           if(err){
                                   return;
                                }
                           })
                        }
                    })
                }) 
            }
        })
       
        socket.on('disconnect',function(){  
            socket.leave(msgRoom);
            userstats.findByIdAndUpdate(socket.request.session.passport.user,{onLine:false},(err)=>{
                if(err){
                    return;
                }
           })  
         })
        })    
    }
var init=function(app){
    const httpsOptions={
        key:fs.readFileSync('./security/cert.key'),
        cert:fs.readFileSync('./security/cert.pem')
    }
    var server=require('http').Server(app);
    var io=require('socket.io')(server);
    
 let pubClient=redis(config.redis.port,config.redis.host,{auth_pass:config.redis.password});
    let subClient=redis(config.redis.port,config.redis.host,{auth_pass:config.redis.password,return_buffer:true});
    io.adapter(adapter({pubClient,subClient}));
    io.use((socket,next)=>{
        require('../session')(socket.request,{},next);
    });
    io.set('transports',['websocket']);
    ioEvents(io);
    return server;
}
module.exports=init