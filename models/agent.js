var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var aggregatePaginate = require('mongoose-aggregate-paginate-v2');

// Create the kill schema
var agentSchema = new Schema({
    name: String,
    id: Number,
    corporationID: Number
})

agentSchema.index({ id: 1 });

agentSchema.plugin(aggregatePaginate);

// Create our kill model
var Agent = mongoose.model('Agent', agentSchema);

module.exports = Agent;