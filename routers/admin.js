var express = require('express');
var router = express.Router();
var User = require('../modules/User.js');
var Arctics = require('../modules/Arctics');
var Arctics = require('../modules/Catagory');


/*User.findOne({name: 'admin'},function (err,user) {
    var arctics = new Arctics({
        title : 'nodejs blog',
        content : 'how to learn',
        tag : 'Node',
        author: user._id
    });
    arctics.save();
});*/

Arctics.findOne({title: 'nodejs blog'}).populate('author').exec(function (err,arctic) {
    console.log(arctic);
})

router.get('/',function (req,res,next) {
    res.render('admin/index');
});

module.exports = router;