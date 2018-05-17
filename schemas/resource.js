//var Kitten = mongoose.model('Kitten', kittySchema); //KItten 是构造函数   kittySchema 是原型
var mongoose = require('mongoose');
var uuidv4 = require('uuid');
var Schema = mongoose.Schema;


  var resource = Schema({
    _id: {
      type: String,
      default: uuidv4()
    },
    pId : {
      type: String,
      default: uuidv4()
    },
    name : String ,
    level: Number ,
    url: String
});
/**
 * 测试uuid模块
 *Resource = mongoose.model('Resource',resource);
 *reso = new Resource({pId: 1, name: 'test', level: 2, url: 'ui/iu'});
 *reso.save();
 * */

module.exports = Resource = mongoose.model('Resource',resource);


