var express = require('express');
var User = require('../models/user');
require('dotenv').config();
var router = express.Router();

router.get('/register', (req, res, next) => {
  res.render('registerForm');
});

router.get('/login', (req, res, next) => {
  res.render('loginForm');
});

router.post('/register', (req, res, next) => {
  User.create(req.body, (err, user) => {
    if (err) return next(err);
    res.redirect('/users/login');
  });
});
router.post('/login', (req, res, next) => {
  // validate user credentials
  var { email, password } = req.body;

  if (!email || !password) {
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
        return res.redirect('/users/login');
      }
      console.log('user logged in');

      // persist logged in user information
      req.session.userId = user.id;
      res.redirect('/dashboard');
    });
  });
}); 

module.exports = router;
