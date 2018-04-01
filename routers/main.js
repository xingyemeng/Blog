var express = require('express');
var router = express.Router();
var User = require('../modules/User.js');
//var users = new User();

router.get('/',function (req,res,next) {
    res.render('index',{
        name:"ysx",
        age : 27
    });
});

module.exports = router;