var express = require('express');
var mongoose = require('mongoose');
var crypto = require('crypto');
var router = express.Router();
var User = require('../modules/User.js');
var Arctics = require('../modules/Arctics');
var Resource = require('../schemas/resource');
var uuidv4 = require('uuid');
var rbac = require('mongoose-rbac')
    , Permission = rbac.Permission
    , Role = rbac.Role;
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

//获取权限列表
router.get('/perList',function (req,res) {
    Resource.find({},function (err,resources) {
        if(err) return handle(err);
        resources.forEach(function (t) {
            t._doc.open = true;
        });
        res.send(resources);
    })
})
//创建资源
/*Resource.create([{name:'权限管理', _id: uuidv4(), pId: 1,level: 1, url: '/api/perList'},{name:'分类管理', _id: uuidv4(), pId: 1,level: 1, url: '/api/cataList'},{name:'文章管理', _id: uuidv4(), pId: 1,level: 1, url: '/api/arcList'}],function (err,resources) {
    console.log(resources);
  var resource = new Resource({
    pId: resources[0]._id,
    name: '资源列表' ,
    level: 2,
    url: '/api/perList'
  });
  resource.save();
  var resource1 = new Resource({
    _id: uuidv4(),
    pId: resources[0]._id,
    name: '角色管理' ,
    level: 2,
    url: '/api/roleList'
  });
  resource1.save();
  var resource2 = new Resource({
    _id: uuidv4(),
    pId: resources[0]._id,
    name: '用户管理' ,
    level: 2,
    url: '/api/userMange'
  });
  resource2.save();
    var resource3 = new Resource({
      _id: uuidv4(),
        pId: resources[1]._id,
        name: '分类列表' ,
        level: 2,
        url: '/api/cataList'
    });
    resource3.save();
    var resource4 = new Resource({
      _id: uuidv4(),
        pId: resources[2]._id,
        name: '文章列表' ,
        level: 2,
        url: '/api/arcList'
    });
    resource4.save();
});*/
/**
 * 添加资源
 *
 * */
//二叉树遍历
function treeTraverse(treeNode, callback) {
    if(treeNode.level == 1){
        callback(treeNode);
        return;
    }else{
        Resource.findOne({_id: treeNode.pId},function (err,resource) {
            treeTraverse(resource,callback);
        })
    }
}
router.post('/addSource',function (req,res) {
    /*var resource = new Resource(req.body);
    resource.save();*/
    Resource.create(req.body,function (err,resource){
        treeTraverse(resource,function (treeNode) {
            Permission.create({subject: treeNode._id,action: resource.name},function () {
                res.send('权限创建成功')
            });
        });
    });
});
/**
 * 导航栏权限管理下的角色管理
 *
 * */
router.get('/roleList',function (req,res) {
    Role.find(function (err, docs) {
        if(err) return handle(err);
        res.send(docs);
    })
});
router.post('/perLimitList',function (req,res) {
    Permission.find({_id: req.body.name},function (err,data) {
        var dataArr = [];
        for(var i = 0; i < data.length;i++){
            dataArr[i] = data[i].action;
        }
        Resource.find({name: dataArr},function (err,data1) {
            Resource.find(function (err,resources) {
                resources.forEach(function (t) {

                    if(JSON.stringify(data1).indexOf(JSON.stringify(t)) != -1){
                        t._doc.checked = true;
                    }
                    t._doc.open = true;
                });
                res.send(resources);
            })
        })
    })
});
/**
 * 导航栏权限管理下的角色管理-权限按钮
 * 表修改
 * */
router.post('/perChange',function (req,res,next) {
    var reqData = req.body.data;
    var arr = [];
    var perID = [];
    reqData.forEach(function (t) {
        arr.push(t.name);
    });
    Permission.find({action: arr},function (err,data) {
        for(var i=0;i<data.length;i++){
            perID.push(data[i]._id);
        }
        Role.findOne({name: req.body.role},function (err, role) {
            role.set({permissions: perID});
            role.save(function (err,updatedole) {
                res.send('权限修改成功');
            });
        })
    })
})
/**
 * 导航栏权限管理下的角色管理-修改按钮
 * 表更新
 * */
router.post('/roleUpdate',function (req, res, next) {
    var obj = req.body;
    Role.findOne({name: obj.name},function (err,role) {
        role.set({name: obj.newname});
        role.save(function (err,updatedole) {
            res.send('角色修改成功');
        });
    })
})
/**
 * 导航栏权限管理下的角色管理-新增按钮
 * 新增角色
 * */
router.post('/addRole',function (req, res, next) {
    Role.create({name: req.body.name},function (err,role) {
        res.send(role);
    })
})
/**
 * 导航栏权限管理下的角色管理-删除按钮
 * 删除角色
 * */
router.post('/delRole',function (req, res, next) {
    Role.deleteOne({name: req.body.name},function (err) {
        res.send('角色删除成功')
    })
})

/**************用户管理*******************/
router.get('/userList',function (req,res) {
    var data = {};
    User.find().populate('roles').exec(function (err, userList) {
        Role.find(function (err,uRoles) {
            if(err) return handle(err);
            res.send({
                userList: userList,
                uRoles: uRoles
            });
        })


    })
});
router.post('/addUserSave',function (req,res,next) {
    User.create(req.body,function (err,user) {
        if(err) return handle(err);
        User.findOne({name: user.name}).populate('roles').exec(function (err,user) {
            if(err) return handle(err);
            res.send(user);
        })
    })
})
router.post('/userUpdate',function (req, res, next) {
    var obj = req.body;
    User.findOne({name: obj.name},function (err,user) {
        user.set({name: obj.newname});
        user.save(function (err,updateduser) {
            res.send('用户修改成功');
        });
    })
});
router.post('/delUser',function (req, res, next) {
    User.deleteOne({name: req.body.name},function (err) {
        res.send('用户删除成功')
    })
})
router.post('/changeUserSave',function (req,res,next) {
    var name = req.body.name
        ,password = crypto.createHash('md5').update(req.body.password, 'utf8').digest("hex")
        ,roles = req.body.roles
        ,id = req.body.id;
    User.findOne({_id: id},function (err,user) {
        user.set({name: name, password: password,roles: roles});
        user.save(function () {
            res.send('用户修改成功！');
        });
    });
});
/**************用户管理end*******************/
//创建权限
/*var rbac = require('mongoose-rbac')
    , Permission = rbac.Permission
    , Role = rbac.Role
    , permissions;

permissions = [
    { subject: '1', action: '全部' }
    , { subject: 'd0dc9f0d-4290-4c9b-8694-682d5e5458ba', action: '用户管理' }
    , { subject: 'd0dc9f0d-4290-4c9b-8694-682d5e5458ba', action: '权限管理' }
    , { subject: 'd0dc9f0d-4290-4c9b-8694-682d5e5458ba', action: '资源列表' }
    , { subject: 'd0dc9f0d-4290-4c9b-8694-682d5e5458ba', action: '角色管理' }
    , { subject: '9de31977-3069-407a-9a63-dd050cb0f9b7', action: '分类管理' }
    , { subject: '9de31977-3069-407a-9a63-dd050cb0f9b7', action: '分类列表' }
    , { subject: 'ba377c75-639a-467a-9ea1-de5397cbb278', action: '文章管理' }
    , { subject: 'ba377c75-639a-467a-9ea1-de5397cbb278', action: '文章列表' }
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