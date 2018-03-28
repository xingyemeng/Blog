var express = require('express');
var router = express.Router();

var app = express();

//模板路径
app.set('views','./views');
//注册模板引擎
app.engine('html', require('ejs').renderFile);
app.set('view engine','html');
//设置公共路径
app.use('/public', express.static(__dirname + '/public'));
router.get('/',function (req,res,next) {
    res.render('index');
})
app.use(router);
app.listen(3000,function (err) {
    if(err){
        console.log(err);
    }else {
        console.log('服务器监听3000端口');
    }
});