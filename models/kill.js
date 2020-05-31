var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Create the kill schema
var killSchema = new Schema({
    uid: String,
    damageReceived: Number,
    date: Date,
    id: Number,
    agentID: Number,
    corporationID: Number,
    robotID: Number,
    zoneID: Number,
    attackers: Array
})

// Create our kill model
var Kill = mongoose.model('Kill', killSchema);

module.exports = Kill;