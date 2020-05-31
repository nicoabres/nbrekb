var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Create the kill schema
var robotSchema = new Schema({
    name: String,
    definition: String,
    id: Number
})

// Create our kill model
var Robot = mongoose.model('Robot', robotSchema);

module.exports = Robot;