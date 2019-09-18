var mongoose=require('mongoose');
var statsSchema=mongoose.Schema({
    _userId:{type:mongoose.Schema.Types.ObjectId,refs:'Users'},
    RemainingConnect:{type:Number,required:true},
    connsume:{type:Number,required:true},
    totalApplies:{type:Number,required:true},
    offerRemaining:{type:Number,default:-1},
    tutionRemaining:{type:Number,default:-1},
    notifyCounter:{type:Number,default:0},
    availablity:{type:Boolean,default:true},
    messageCounter:{type:Number,default:0},
    room:String,
    mRoom:[String],
    onLine:Boolean,
    resetTime:{type:Date,default:Date.now()},
    lastLogin:{type:Date,default:Date.now()}
});
var userStats=mongoose.model('userStats',statsSchema);
module.exports=userStats;