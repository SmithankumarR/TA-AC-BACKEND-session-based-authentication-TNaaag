var express = require('express');
var User = require('../models/user')
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('You have successfully register!')
  next();
});


router.get('/register', function(req,res,next) {
  res.render('registerForm');
  next();
});

router.post('/register', function(req,res,next) {
  User.create(req.body , (err,user) => {
    if(err) return next (err);
    console.log(err, user);
    res.redirect('/users')
  })
})

module.exports = router;
