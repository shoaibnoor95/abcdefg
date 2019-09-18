var mongoose=require('mongoose');
var postSchema=mongoose.Schema({
    _userId:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'User'},
    class:{type:String},
    offerContent:{type:String},
    favoriteArea:{type:String},
    date:{type:Date, default:Date.now()},
    area:{type:String},
    city:{type:String, required:true},
    type:{type:String, required:true},
    category:[String],
    applied:{type:[String]},
    studentGender:{type:String},
    requiredTeacherSpecification:{type: String},
    invited:[String],
    close:{type:Boolean,default:false},
    views:{type:Number,default:0} 
})
var post =mongoose.model('post',postSchema);
module.exports=post;