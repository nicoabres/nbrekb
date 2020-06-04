var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var aggregatePaginate = require('mongoose-aggregate-paginate-v2');

// Create the kill schema
var corporationSchema = new Schema({
    name: String,
    id: Number
})

corporationSchema.index({ id: 1 });

corporationSchema.plugin(aggregatePaginate);

// Create our kill model
var Corporation = mongoose.model('Corporation', corporationSchema);

module.exports = Corporation;