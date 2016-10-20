var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

//Register
router.get('/register', function(req, res){
  res.render('register');
});

//Login
router.get('/login', function(req, res){
  res.render('login');
});

//Register User
router.post('/register', function(req, res){
  var nickname = req.body.nickname;
  var password = req.body.password;
  var password2 = req.body.password2;
  var mobileNumber = req.body.mobileNumber;
  var email = req.body.email;

console.log(nickname);

  //Validation
  req.checkBody('nickname', 'Nickname is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Password do not match').equals(req.body.password);
  req.checkBody('mobileNumber', 'Mobile Number is required').notEmpty();
 //  req.checkBody('mobileNumber', 'Mobile Number is not valid').isMobilePhone();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();

  var errors = req.validationErrors();
//
  if(errors){
    res.render('index',{
      errors:errors
    });
  }else{
    console.log('Yes');
    var newUser = new User({
      nickname: nickname,
      email:email,
      mobileNumber:mobileNumber,
      password: password
    });

    User.CreateUser(newUser, function(err, user){
      if(err) throw err;
      console.log(user);
    });

    req.flash('success_msg', 'You are registered.......');

    res.redirect('/users/register');
  }
});

passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByEmail(email, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {

   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));

passport.serializeUser(function(user, done){
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  User.getUserById(id, function(err, user){
    done(err, user);
  });
})

router.post('/login', passport.authenticate('local', {successRedirect:'/users/login', failureRedirect:'/', failureFlash: true}),
function(req, res){
res.redirect('login');
});


module.exports = router;
