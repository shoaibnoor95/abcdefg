const mongoose=require('mongoose');
var logSchema=mongoose.Schema({
    _userId:{type:mongoose.Schema.Types.ObjectId,refs:'Users'},
    userIp:{type:String, required:true},
    actionType:String,
    sessionId:String,
    browsingAgent:String,
    createdAt:{type:Date, default:Date.now()},
});

var userLogs=mongoose.model('userLogs',logSchema);

module.exports=userLogs;