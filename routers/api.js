var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var User = require('../modules/User.js');
var Arctics = require('../modules/Arctics');

router.get('/login',function (req,res,next) {
    res.render('admin/login');
});
router.post('/login',function (req,res,next) {
    User.findOne({name:req.body.username},function (err, user) {
        if(user){
            console.log(user)
            req.session.username = user.name;
            res.redirect('/admin');
        }else{
            res.send('用户不存在');
        }
    })
});
router.post('/logout',function (req,res,next) {
    req.session.destroy();
    res.redirect('/api/login')
});
//注册界面显示
router.get('/register',function (req,res) {
    res.render('admin/register');
});
//注册数据提交
router.post('/register',function (req, res, next) {
    var user = new User({
        name : req.body.username,
        password: crypto.createHash('md5').update(req.body.password, 'utf8').digest("hex")
    });
    user.save(function (err,tank) {
        if(err) return err;
        res.send(tank);
    });
})
//获取已有的用户列表
router.get('/userList',function (req,res) {
    User.find(function (err,users) {
        if(users){
            res.send(users);
        }else{
            res.send('')
        }
    })
});
module.exports = router;