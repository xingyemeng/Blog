var mongoose = require('mongoose');
var users = require('../schemas/user');

var User = mongoose.model('User',users); //此处的users是集合名称

module.exports = User;