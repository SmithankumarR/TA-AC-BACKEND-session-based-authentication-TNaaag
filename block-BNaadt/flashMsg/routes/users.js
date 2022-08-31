var express = require('express');
var User = require('../models/user');
require('dotenv').config();
var router = express.Router();

router.get('/register', (req, res, next) => {
  res.render(
    'registerForm',
    { message1: req.flash('error',[0]) },
  );
  next();

});

router.get('/login', (req, res, next) => {
  res.render(
    'loginForm',
    { message3: req.flash('error',[2]) },
  );
  next();
});

router.post('/register', (req, res, next) => {
  User.create(req.body, (err, user) => {
    var { email, password } = req.body;

    if (err) return next(err);
    if (email === user.email) {
      req.flash('error', 'email should be unique');
    }
    if (password.length < 4) {
      req.flash('error', ' password is less than 4 chars');
    }
    res.redirect('/users/login');
  });
});

router.post('/login', (req, res, next) => {
  // validate user credentials
  var { email, password } = req.body;

  if (!email || !password) {
    req.flash('error', 'These Email is not registered');
    return res.redirect('/users/login');
  }
  // find user
  User.findOne({ email }, (err, user) => {
    console.log(req.body, user);
    if (err) return next(err);
    // no user
    if (!user) {
      return res.redirect('/users/login');
    }
    // compare password
    user.verifyPassword(password, (err, result) => {
      console.log(err, result);
      if (err) return next(err);
      if (!result) {
        req.flash('error', 'Password is Wrong');
        return res.redirect('/users/login');
      }
      console.log('user logged in');

      // persist logged in user information
      req.session.userId = user.id;
      res.redirect('/dashboard');
    });
  });
});

// logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/users/login');
});

module.exports = router;
