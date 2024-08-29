const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
var morgan = require("morgan");
require("dotenv").config();

const Subject = require("./models/Subject");

// middleware
const corsOptions = { origin: "http://localhost:3000" };

app.use(express.json());
app.use(cors(corsOptions));
app.use(morgan("tiny"));

// connect MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`App is Listening on PORT ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

//GET methods

app.get("/", async (req, res) => {
  let subj = await Subject.find();
  res.status(200).json(subj.map((block) => block.title));
});

app.get("/:sub", async (req, res) => {
  try {
    let subj = await Subject.findOne({ title: req.params.sub });
    res.status(200).json(subj.blocks.map((block) => block.title));
  } catch (err) {
    res.status(400).json(err);
  }
});

app.get("/:sub/:bloc", async (req, res) => {
  try {
    const subj = await Subject.findOne(
      {
        title: req.params.sub,
        blocks: { $elemMatch: { title: req.params.bloc } },
      },
      { "blocks.$": 1 } // Project only the matched comment
    );
    // let sSubj = subj.blocks.map(block=>block.title);
    res.status(200).json(subj.blocks[0].topics.map((topic) => topic.title));
  } catch (err) {
    res.status(400);
  }
});

app.get("/:sub/:bloc/:topic", async (req, res) => {
  try {
    const subj = await Subject.findOne(
      {
        title: req.params.sub,
        blocks: { $elemMatch: { title: req.params.bloc } },
      },
      { "blocks.$": 1 } // Project only the matched comment
    );
    let sSubj = subj.blocks[0].topics.filter((topic) => {
      return topic.title == req.params.topic;
    });
    res.status(200).json(sSubj[0]);
  } catch (err) {
    res.status(400);
  }
});

//POST methods

app.post("/:subject", async (req, res) => {
  let newSub = await Subject.exists({ title: req.params.subject });

  if (newSub == null) {
    const newSubject = await Subject.create({
      title: req.params.subject,
    });
    res.status(201).json(newSubject);
  } else {
    res.status(401).json("Already exists");
  }
});

app.post("/:subject/:block", async (req, res) => {
  let newSub = await Subject.exists({ title: req.params.subject });
  if (newSub == null) {
    const newSubject = await Subject.create({
      title: req.params.subject,
      blocks: [{ title: req.params.block }],
    });
    res.status(201).json(newSubject);
  } else {
    oldSub = await Subject.findOneAndUpdate(
      { title: req.params.subject },
      { $push: { blocks: { title: req.params.block } } },
      { new: true, useFindAndModify: false }
    );
    res.status(200).json("updated");
  }
});

app.post("/:sub/:blo/:topic", async (req, res) => {
  const updatedSub = await Subject.findOneAndUpdate(
    { title: req.params.sub, "blocks.title": req.params.blo },
    {
      $push: {
        "blocks.$.topics": { title: req.params.topic},
      },
    }
  );

  res.status(200).json("Hope it works");
});

app.put("/:sub/:blo/:topic", async (req, res) => {
  try {
    const updatedEntry = await Subject.findOneAndUpdate(
      {
        title: req.params.sub,
        'blocks.title': req.params.blo,
        'blocks.topics.title': req.params.topic,
      },
      {
        $set: { 'blocks.$[block].topics.$[topic].text': req.body[0] },
      },
      {
        arrayFilters: [
          { 'block.title': req.params.blo },
          { 'topic.title': req.params.topic }
        ],
        new: true,
      }
    );

    if (!updatedEntry) {
      console.log('Post, Comment, or User not found');
      return;
    }

    console.log('User name updated successfully');
    res.status(200)
  } catch (error) {
    console.error('Error updating user name:', error);
  }
});



//UTILITY methods

const camelToStr = (camelCase) => {
  let newStr = "";
  let letters = "abcdefghijklmnopqrstuvwxyz";
  for (let char of camelCase) {
    if (letters.includes(char)) {
      newStr = newStr + char;
    } else {
      newStr = newStr + " " + char;
    }
  }
  return newStr.slice(1);
};
