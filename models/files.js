var mongoose=require('mongoose');
var filesSchema=new mongoose.Schema({
    _userId:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'User'},
    files:{data:Buffer,contentType:String},
});
var fileSchema=mongoose.model('fileSchema',filesSchema);
module.exports=fileSchema