var express = require('express');
var mongoose = require('mongoose');

var app = express();

//模板路径
app.set('views','./views');
//注册模板引擎
app.engine('html', require('ejs').renderFile);
app.set('view engine','html');
//设置公共路径
app.use('/public', express.static(__dirname + '/public'));
//路由 装载点 test
app.use('/',require(__dirname+'/routers/main.js'));
app.use('/admin',require(__dirname+'/routers/admin.js'));

//app.use('/admin',router); 应用级中不用路由级

mongoose.connect('mongodb://localhost/blog',function (err) {
    if(err){
        console.log('数据可链接失败');
    }else {
        console.log('数据库链接成功');
        app.listen(3000);
    }
});