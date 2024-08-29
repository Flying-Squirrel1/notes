const mongoose = require("mongoose");


const {Schema, model} = mongoose;

const topicSchema = new Schema({
    title: {type: String, required: true},
    text: { type: String, default: '' },
    keyFacts: [{
        term: String,
        definition: String
    }]
});

module.exports=  model('Topic', topicSchema);
