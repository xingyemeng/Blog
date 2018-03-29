//var Kitten = mongoose.model('Kitten', kittySchema); //KItten 是构造函数   kittySchema 是原型
var mongoose = require('mongoose');
var user = new mongoose.Schema({
    username : 'string',
    password : 'string'
});

module.exports = user;


