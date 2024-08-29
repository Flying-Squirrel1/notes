const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const topicSchema = new Schema({
  title: {type: String, required: true},
  text: { type: String, default: '' },
  keyFacts: [{
      term: String,
      definition: String
  }]
});

const blockSchema = new Schema({
  title: String,
  topics: [topicSchema],
});

const subjectSchema = new Schema({
  title: String,
  blocks: [blockSchema],
});

module.exports = model("Subject", subjectSchema);
