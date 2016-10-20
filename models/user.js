var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');


//User Schema
var userSchema = mongoose.Schema({
  nickname:{
    type: String,
    index:true
  },
  password:{
    type:String
  },
  mobileNumber:{
    type:String
  },
  email:{
    type:String
  }
});

var User = module.exports = mongoose.model('User', userSchema);

module.exports.CreateUser = function(newUser, callback){
  bcrypt.genSalt(10, function(err, salt){
  bcrypt.hash(newUser.password, salt, function(err, hash){
      newUser.password = hash;
      newUser.save(callback);
  });
});
}

module.exports.getUserByEmail = function(email, callback){
  var query = {email: email};
  User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, function(err, isMatch){
    if(err) throw err;
    callback(null, isMatch);
   });
}
