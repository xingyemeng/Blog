//var Kitten = mongoose.model('Kitten', kittySchema); //KItten 是构造函数   kittySchema 是原型
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Session = Schema({
    name : String ,
    session: String
});



module.exports = Session = mongoose.model('Session',resource);


