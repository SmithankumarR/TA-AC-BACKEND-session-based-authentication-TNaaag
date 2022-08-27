// express
var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

// instantiate
var app = express();

// middleware
app.use(logger('dev'));
app.use(cookieParser())


app.use((req,res,next) => {
    res.cookie = ("User" , 1);
})
// routes
app.get('/', (req,res) => {
    res.send("hey , you have created a new cookie")
})
// error handler
app.use((err,req,res,next) => {
    console.log(err);
    next();
})
// listen
app.listen(3000, ()=> {
    console.log("listening on port 4000...");
})