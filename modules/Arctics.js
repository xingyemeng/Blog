var mongoose = require('mongoose');
var arctic = require('../schemas/arctic');

var Arctics = mongoose.model('Arctics',arctic);



module.exports = Arctics;






