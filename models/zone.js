var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var aggregatePaginate = require('mongoose-aggregate-paginate-v2');

// Create the kill schema
var zoneSchema = new Schema({
    name: String,
    definition: String,
    id: Number
})

zoneSchema.index({ id: 1 });

zoneSchema.plugin(aggregatePaginate);

// Create our kill model
var Zone = mongoose.model('Zone', zoneSchema);

module.exports = Zone;