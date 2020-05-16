import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

// Database setup:
const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost/mongo-post-codealong";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Mongoose model setup:

const Task = mongoose.model("Task", {
  text: {
    type: String,
    required: true,
    minlenght: 5,
  },
  complete: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello funny world");
});

// GET endpoint: Return all tasks, sort on date, limit to 20:

app.get("/tasks", async (req, res) => {
  const tasks = await Task.find().sort({ createdAt: "desc" }).limit(20).exec();
  res.json(tasks);
});

// POST endpoint 
// - Take clients input and send to database
// Validate on input and act accordingly

app.post("tasks", async (req, res) => {
  // retrieve info sent by client to our API endpoint:
  const { text, complete } = req.body;
  // use our mongoose model to create the database entry:
  const task = new Task({ text, complete });

  try {
    // success:
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ message: "Could not save task to Database", error: err.errors });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
