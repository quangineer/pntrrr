//this is for MDB:
const mongoose = require("mongoose");

//this is for API:
const express = require("express");
const app = express();
app.use(express.json());

//this is for server and browser to talk: middleware
const cors = require("cors");
app.use(cors());

//create an URI to connect with mongoDB:
// const URI = "mongodb://127.0.0.1:27017/FE"; //locally: cai nay phai lam theo ong y
const URI = "mongodb+srv://nguyenq25:LohK9uqIj7rXCtTv@cluster0chayvaodau.6ubchln.mongodb.net/DoanNayTrongCodeDiDau";

//connect with mongoDB from this backend:
mongoose
  .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("CONGRATS FOR SUCCESSFULLY CONNECTING TO MONGODB");
  })
  .catch((err) => {
    console.error(err);
  });

//create schema:
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String },
});

//define a model:
const book = mongoose.model("Booklist", bookSchema);
//"Booklist" = collection/subfolder/plural later by mongoDB

// 1. Send a GET request to get ALL BOOKS:
app.get("/", async (req, res) => {
    console.log("ABC");
  book
    .find()
    .then(function (data) {
      console.log("All books database is here:", data);
      res.json(data);
    })
    .catch((error) => res.status(400).json("Error occurred: " + error));
});

// 2. Send a GET request to get a single book by id:
app.get("/:id", async (req, res) => {
  book
    .findById(req.params.id)
    .then(function (data) {
      console.log("With ID " + req.params.id + ", here is the book: ", data);
      res.json("Found the book! " + req.params.id + data);
    })
    .catch((error) => res.status(400).json("Error occurred: " + error));
});

// 3. Send a POST request to add/save book:
app.post("/", async (req, res) => {
  // console.log(req.body);
  const { title, author, description } = req.body;
  const newBook = new book({
    title,
    author,
    description,
  });
  console.log(newBook);
  newBook
    .save()
    .then(() => res.json("A new book is added/saved into the database!"))
    .catch((error) => res.status(400).json("Error occurred: " + error));
});

// 4. Send a PUT request to update a book by id:
app.put("/:id", async (req, res) => {
  await book
    .findById(req.params.id)
    .then((bookObjectFoundByID) => {
      bookObjectFoundByID.title = req.body.title;
      bookObjectFoundByID.author = req.body.author;
      bookObjectFoundByID.description = req.body.description;
      bookObjectFoundByID
        .save()
        .then(() => res.json("Updated book by ID " + req.params.id))
        .catch((error) => res.status(404).json("Error occurred: " + error));
    })
    .catch((error) => res.status(400).json("Error occurred: " + error));
});

// 5. Send a DELETE request to delete a book by id:
app.delete("/:id", async (req, res) => {
  await book
    .findByIdAndDelete(req.params.id)
    .then(() => res.json("Deleted a book by ID " + req.params.id))
    .catch((err) => res.status(400).json("Error: " + err));
});

//Telling port that server is running at:
const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});