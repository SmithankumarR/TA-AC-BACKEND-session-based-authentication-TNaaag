var express = require('express');
var User = require('../models/user');
var router = express.Router();
var session = require('express-session');

router.get('/register', (req, res, next) => {
  res.render('registerForm', {error : req.flash('error')[0]});
});

router.get('/login', (req, res, next) => {
  res.render('loginForm',{error : req.flash('error')[0]});
});

router.post('/register', (req, res, next) => {
  User.create(req.body, (err, user) => {
    if(err) {
      if(err.name === 'MongoError'){
        req.flash("error", "Email is already exits");
        return res.redirect('/users/register');
      }
      if(err.name === 'ValidationError'){
        req.flash("error", err.message);
        return res.redirect("/users/register");
      }
    }
    res.redirect('/users/login');
  });
});
router.post('/login', (req, res, next) => {
  // validate user credentials
  var { email, password } = req.body;

  if (!email || !password) {
    req.flash("error","Email / password required");
    return res.redirect('/users/login');
  }
  // find user
  User.findOne({ email }, (err, user) => {
    console.log(req.body, user);
    if (err) return next(err);
    // no user
    if (!user) {
      req.flash('error', 'These Email is not registered yet!')
      return res.redirect('/users/login');
    }
    // compare password
    user.verifyPassword(password, (err, result) => {
      console.log(err, result);
      if (err) return next(err);
      if (!result) {
        req.flash("Error", "incorrect Password");
        return res.redirect('/users/login');
      }
      console.log('user logged in');

      // persist logged in user information
      req.session.userId = user.id;
      res.redirect('/dashboard');
    });
  });
}); 
router.get('/logout',(req,res)=>{
  req.session.destroy();
  res.clearCookie('connect-sid');
})
module.exports = router;
