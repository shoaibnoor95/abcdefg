var mongoose=require('mongoose');
var statsSchema=mongoose.Schema({
    _userId:{type:mongoose.Schema.Types.ObjectId,refs:'User'},
    monnth:{type:String ,requird:true},
    with:{type:String,requird:true},
    createdAt:{type:Date,default:Date.now()},
    transact:{type:String,requird:true},
    topic:{type:String},
});
var stats=mongoose.model('stats',statsSchema);
module.exports=stats;