var mongoose=require('mongoose');
var notifier=mongoose.Schema({
    _userId:{type:mongoose.Schema.Types.ObjectId,refs:'Users'},
    notText:String,
    notLink:String,
    text:String,
    postId:String,
    othersId:{type:mongoose.Schema.Types.ObjectId,refs:'Users'},
    createdAt:{type:Date,default:Date.now(),expires:143200} 
});
var notify=mongoose.model('notify',notifier);
module.exports=notify;