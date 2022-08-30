var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Welcome to Authentication ' });
});
router.get('/dashboard',(req,res) =>{
  console.log(req.session)
  res.render("dashboard")
})
module.exports = router;
