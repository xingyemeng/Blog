var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var User = require('../modules/User.js');
var Arctics = require('../modules/Arctics');
var Resource = require('../schemas/resource');

var Catagories = require('../modules/Catagory');
var rbac = require('mongoose-rbac')
    , Permission = rbac.Permission
    , Role = rbac.Role
    , permissions;


//将对象元素转换成字符串以作比较
function obj2key(obj, keys){
    var n = keys.length,
        key = [];
    while(n--){
        key.push(obj[keys[n]]);
    }
    return key.join('|');
}
//去重操作
function uniqeByKeys(array,keys){
    var arr = [];
    var hash = {};
    for (var i = 0, j = array.length; i < j; i++) {
        var k = obj2key(array[i], keys);
        if (!(k in hash)) {
            hash[k] = true;
            arr .push(array[i]);
        }
    }
    return arr ;
}
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
    //console.log(arctic);
})
//登录认证管理
router.all('*',function (req, res, next) {
    if(req.session.username){

        next();
    }else {
        res.redirect('api/login');
    }
});
router.get('/',function (req,res,next) {
    //根据权限划分导航栏菜单
    var navList = [];
    //菜单栏链接
    var hrefList= [];
    User.findOne({name: req.session.username},function (err,user) {
        if(err) return handle(err);
        Role.find({_id: user.roles}).populate({
            path: 'permissions',
            populate: {
                path: 'subject'
            }
        }).exec(function (err,role) {
            for(var i=0;i<role.length;i++){
                for(var j=0;j<role[i].permissions.length;j++){
                    /*if(navList.indexOf(role[i].permissions[j].subject) == -1){
                        navList.push(role[i].permissions[j].subject);
                    }*/
                    if(role[i].permissions[j].subject.level == 1  ){
                        if(navList.indexOf(role[i].permissions[j].subject.name) == -1){
                            var navObj = {};
                            navObj.name = role[i].permissions[j].subject.name;
                            navObj.path = role[i].permissions[j].subject.url;
                            navList.push(navObj);
                        }
                    }
                }
            }
            navList = uniqeByKeys(navList,['name']);
            res.render('admin/index',{
                navList: navList
            });
        });

    });
});
router.get('/permission',function (req,res,next) {

    res.render('admin/per/permission');
});
//查找当前页面的权限
function checkPermission(curName) {
    var curId = mongoose.Schema.Types.ObjectId;
    Resource.findOne({name:'权限管理'},function (err,resource) {
        if(err) return handle(err);
        curId = resource._id;
    })
    User.findOne({name: curName},function (err,user) {
        if(err) return handle(err);
        Role.find({_id: user.roles}).populate({
            path: 'permissions'
        }).exec(function (err,role) {
            for(var i=0;i<role.length;i++){
                for(var j=0;j<role[i].permissions.length;j++){
                    console.log('_id:' + role[i].permissions[j].subject);
                    console.log(role[i].permissions[j].subject  == curId);
                    console.log('curId:' + curId);

                    Resource.find([{pId: role[i].permissions[j].subject},[level: ]],function (err,resource) {
                        console.log(resource);
                    });


                }
            }
        });
    });
}
//导航栏的权限管理路由
router.get('/perList',function (req, res, next) {
    checkPermission(req.session.username);
    res.render('admin/per/permission');
})
module.exports = router;