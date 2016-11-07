var express = require('express');
var router = express.Router();

var winston=require('winston');
var logger1 = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: 'logs/logs.log' })
    ]
});


/* GET home page. */


exports.index=function(req,res){
console.log("here");
    logger1.log('info',"Redirecting to login Page");
    res.render('login',{title:'welcome here'});
}

