const mongoose=require('mongoose');
var feedbackSchema=mongoose.Schema({
    type:{type: String, required:true},
    text:{type:String, required:true},
    email:{type:String, required:true},
    username:{type:String,required:true},
    date:{type: Date,default:Date.now()},
})
var feedback=mongoose.model('feedback',feedbackSchema);
module.exports=feedback;