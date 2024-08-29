const mongoose = require("mongoose");
const Topic = require("./Topic");
const {Schema, model} = mongoose;

const blockSchema = new Schema({
    title: String,
    topics: [Topic]
});
module.exports=  model('Block', blockSchema);
