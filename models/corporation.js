var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Create the kill schema
var corporationSchema = new Schema({
    name: String,
    id: Number
})

// Create our kill model
var Corporation = mongoose.model('Corporation', corporationSchema);

module.exports = Corporation;