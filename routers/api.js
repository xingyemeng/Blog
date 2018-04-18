var express = require('express');
var mongoose = require('mongoose');
var crypto = require('crypto');
var router = express.Router();
var User = require('../modules/User.js');
var Arctics = require('../modules/Arctics');
var Resource = require('../schemas/resource');

var responseJson = {
    status: 0,
    msg: ''
};
//登录前访问首页，显示登录界面
router.get('/login',function (req,res,next) {
    res.render('admin/login');
});
//验证登录
router.post('/login',function (req,res,next) {
    User.findOne({name:req.body.username},function (err, user) {
        if(user){
            if(user.password != crypto.createHash('md5').update(req.body.password, 'utf8').digest("hex")){

                res.send("密码不正确")
            }else{
                req.session.username = user.name;
                res.redirect('/admin');
            }

        }else{
            res.send('用户不存在');
        }
    })
});
//退出 清空session
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
        responseJson.status = 200;
        responseJson.msg = '注册成功！';

        res.send(responseJson);
    });
    user.addRole('admin',function () {});
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

//创建资源
/*Resource.create([{name:'分类管理',level: 1,url: '/api/cataList',pId:new mongoose.Types.ObjectId()},{name:'文章管理',level: 1,url: '/api/arcList',pId:new mongoose.Types.ObjectId()}],function (err,resources) {
    console.log(resources);
    var resource = new Resource({
        pId: resources[0]._id,
        name: '分类列表' ,
        level: 2,
        url: '/api/cataList'
    });
    resource.save();
    var resource1 = new Resource({
        pId: resources[1]._id,
        name: '文章列表' ,
        level: 2,
        url: '/api/arcList'
    });
    resource1.save();
});*/
//创建权限
/*var rbac = require('mongoose-rbac')
    , Permission = rbac.Permission
    , Role = rbac.Role
    , permissions;

permissions = [
    { subject: '5ad5b2bce2dfea23d4e08a70', action: '角色管理' }
    , { subject: '5ad5b2bce2dfea23d4e08a70', action: '用户管理' }
    , { subject: '5ad5b2bce2dfea23d4e08a70', action: '权限管理' }
    , { subject: '5ad6dc6eafd1f71ad4515f17', action: '分类列表' }
    , { subject: '5ad6dc6eafd1f71ad4515f18', action: '文章列表' }
];

Permission.create(permissions, function (err) {
    var perms, admin, developer, readonly;

    perms = Array.prototype.slice.call(arguments, 1);
    console.log(perms);
    admin = new Role({ name: 'admin' });

    admin.permissions = perms[0];
    console.log(admin);
    admin.save(function (err, admin) {
        developer = new Role({ name: 'developer' });
        developer.permissions = perms[0].slice(3, 4);
        developer.save(function (err, developer) {
            readonly = new Role({ name: 'readonly' });
            readonly.permissions = [perms[0][4]];
            readonly.save(function (err, readonly) {
                // ...
            });
        });
    });
});*/
//用户添加角色
/*User.findOne({name:'admin'},function (err,user) {
    user.addRole('admin',function () {
        
    })
})*/
module.exports = router;