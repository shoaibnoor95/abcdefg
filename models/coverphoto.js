var mongoose=require('mongoose');
var coverSchema=new mongoose.Schema({
    _userId:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'User'},
    coverPhoto:{data:Buffer,contentType:String},
});
var coverSchema=mongoose.model('coverSchema',coverSchema);
module.exports=coverSchema;