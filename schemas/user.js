//var Kitten = mongoose.model('Kitten', kittySchema); //KItten 是构造函数   kittySchema 是原型
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = Schema({
    username : 'string',
    password : 'string',
    num:{
        type: Number,
        get: function (t) {
            return Math.round(t);
        }
    },
    posts : [{type: Schema.Types.ObjectId, ref: 'Arctic'}]
});

var Test = mongoose.model('Test',user);
var doc = new Test();
doc.num = 2.001;
console.log(doc.num);
module.exports = user;


