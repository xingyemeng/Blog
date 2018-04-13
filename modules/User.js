var mongoose = require('mongoose');
var arctics = require('../modules/Arctics');
var users = require('../schemas/user');


//var User = mongoose.model('User',users); //此处的users是集合名称
var User = mongoose.model('User',users);

/*var user = new User({
    _id : new mongoose.Types.ObjectId(),
    name : 'admin',
    password : 'admin'
});

user.save(function (err) {

})*/


module.exports = User;