//var Kitten = mongoose.model('Kitten', kittySchema); //KItten 是构造函数   kittySchema 是原型
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var resource = Schema({
    pId : Schema.Types.ObjectId ,
    name : String ,
    level: Number ,
    url: String
});



module.exports = Resource = mongoose.model('Resource',resource);


