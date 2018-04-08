var mongoose = require('mongoose');
var catagory = require('../schemas/category');

var Catagory = mongoose.model('Catagory',catagory);


module.exports = Catagory;

