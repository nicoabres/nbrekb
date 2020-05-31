var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Create the kill schema
var agentSchema = new Schema({
    name: String,
    id: Number,
    corporationID: Number
})

// Create our kill model
var Agent = mongoose.model('Agent', agentSchema);

module.exports = Agent;