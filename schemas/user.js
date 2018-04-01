//var Kitten = mongoose.model('Kitten', kittySchema); //KItten 是构造函数   kittySchema 是原型
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = Schema({
    username : 'string',
    password : 'string',
    posts : [{type: Schema.Types.ObjectId, ref: 'Arctic'}]
});

module.exports = user;


