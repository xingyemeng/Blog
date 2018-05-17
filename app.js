var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');

var app = express();

//模板路径
app.set('views','./views');
//注册模板引擎
app.engine('html', require('ejs').renderFile);
app.set('view engine','html');
//body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//设置公共路径
app.use('/public', express.static(__dirname + '/public'));
//路由 装载点 test
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        path: '/',
        httpOnly: true,
        secure: false
    }
}));
app.get('/',function (req, res, next) {
    console.log(req.session.cookie.path);
    next();
});
app.use('/',require(__dirname+'/routers/main.js'));
app.use('/api',require('./routers/api'));
app.use('/admin',require(__dirname+'/routers/admin.js'));

//app.use('/admin',router); 应用级中不用路由级


mongoose.connect('mongodb://localhost/blog_me',function (err) {
    if(err){
        console.log('数据可链接失败');
    }else {
        console.log('数据库链接成功');
        app.listen(3000);
    }
});