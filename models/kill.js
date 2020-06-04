var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var aggregatePaginate = require('mongoose-aggregate-paginate-v2');

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

killSchema.index({ id: 1 });

killSchema.plugin(aggregatePaginate);

// Create our kill model
var Kill = mongoose.model('Kill', killSchema);

module.exports = Kill;