//var Kitten = mongoose.model('Kitten', kittySchema); //KItten 是构造函数   kittySchema 是原型
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var rbac = require('mongoose-rbac');

var users = new Schema({
    name : 'string',
    password : 'string',
    posts : [{type: Schema.Types.ObjectId, ref: 'Arctics'}]
});

users.plugin(rbac.plugin);

module.exports = users;


