const mongoose=require('mongoose');
var bcrypt=require('bcrypt-nodejs');
var SALT_FACTOR=10;
var userSchema=mongoose.Schema({
    username:{type:String,requird:true, index:{unique:true,dropDups:true}},
    password:{type:String,required:true},
    email:{type:String, required:true,index:{unique:true}},
    phone_Number:{type:String,required:true,index:{unique:true}},
    createdAt:{type:Date, default:Date.now},
    emailAuth:{type:Boolean,default:false},
    phoneAuth:{type:Boolean,default:false},
    fileAuth:{type:Boolean,default:false},
    passwordResetToken:String,
    firstName:String,
    lastName:String,
    area:String,
    city:String,
    dOb:Date,
    country:String,
    moto:String,
    class:String,
    ans1:String,
    changeEmail:String,
    ans2:String,
    ans3:String,
    institue:String,
    postalCode:Number,
    qualification:String,
    teach:[String],
    spec1:String,
    request:{type:[String]},
    study:String,
    type:String,
    school:String,
    subject:String,
    form_filed:{type:Boolean,default:false},
    gender:String,
    hobby:String,
    photo:{data:Buffer,contentType:String},
    cnic: {type :String, default:''},
    friends:[String],
    learn:String,
    changePhone:{type:String},
    approved:{type:Boolean,required:true,default:false}
});
var noop=function(){};
userSchema.pre("save", function(done) {
  var user = this;

  if (!user.isModified("password")) {
    return done();
  }

  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) { return done(err); }
    bcrypt.hash(user.password, salt, noop, function(err, hashedPassword) {
      if (err) { return done(err); }
      user.password = hashedPassword;
      done();
    });
  });
});

userSchema.methods.checkPassword = function(guess, done) {
  bcrypt.compare(guess, this.password, function(err, isMatch) {
    done(err, isMatch);
  });
};



var User = mongoose.model("User", userSchema);

module.exports = User;