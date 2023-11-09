const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
require("dotenv").config();
const port = 3000;

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Define the Book Schema
const BookSchema = new mongoose.Schema({
  title: String,
  author: String,
  summary: String,
});

const Book = mongoose.model("Book", BookSchema);

// Creating record (Add New Book to bookstore)
app.post("/api/books", (req, res) => {
  const newBook = new Book(req.body);
  newBook.save((err, book) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(201).json(book);
    }
  });
});

// Reading a record (View List of All Books)
app.get("/api/books", (req, res) => {
  Book.find({}, (err, books) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(books);
    }
  });
});

// Reading specific record (View Details of Specific Book by ID)
app.get("/api/books/:id", (req, res) => {
  Book.findById(req.params.id, (err, book) => {
    if (err) {
      res.status(500).send(err);
    } else if (!book) {
      res.status(404).send("Book not found");
    } else {
      res.json(book);
    }
  });
});

// Update record (Update Book's Details)
app.put("/api/books/:id", (req, res) => {
  Book.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, book) => {
      if (err) {
        res.status(400).send(err);
      } else if (!book) {
        res.status(404).send("Book not found");
      } else {
        res.json(book);
      }
    }
  );
});

// Deleting a record (Remove a Book)
app.delete("/api/books/:id", (req, res) => {
  Book.findByIdAndRemove(req.params.id, (err, book) => {
    if (err) {
      res.status(500).send(err);
    } else if (!book) {
      res.status(404).send("Book not found");
    } else {
      res.sendStatus(204);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
