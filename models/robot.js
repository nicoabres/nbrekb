var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var aggregatePaginate = require('mongoose-aggregate-paginate-v2');

// Create the kill schema
var robotSchema = new Schema({
    name: String,
    definition: String,
    id: Number
})

robotSchema.plugin(aggregatePaginate);

// Create our kill model
var Robot = mongoose.model('Robot', robotSchema);

module.exports = Robot;