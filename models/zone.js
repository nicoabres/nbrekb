var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Create the kill schema
var zoneSchema = new Schema({
    name: String,
    definition: String,
    id: Number
})

// Create our kill model
var Zone = mongoose.model('Zone', zoneSchema);

module.exports = Zone;