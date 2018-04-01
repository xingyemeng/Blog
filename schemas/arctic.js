//var Kitten = mongoose.model('Kitten', kittySchema); //KItten 是构造函数   kittySchema 是原型
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = Schema({
    title : 'string',
    content : 'string',
    author : {type: Schema.Types.ObjectId, ref: 'User'},
    tag : 'string',
    time : 'Date',
    pid : [{type: Schema.Types.ObjectId, ref: 'Category'}]
});

module.exports = user;


