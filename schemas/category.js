var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var catagory = new Schema({
    title : 'string',
    cid : [{type: Schema.Types.ObjectId, ref: 'Arctic'}]
});


module.exports = catagory;