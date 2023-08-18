const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  const get_books = new Promise((resolve, reject) => {
    resolve(res.send(JSON.stringify(books, null, 4)));
  });

  get_books.then(() => console.log("Promise for task 10 resolved!"));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = await req.params.isbn;

  res.send(books[isbn]);
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  let author = await req.params.author;
  let filteredBooks = [];
  for (const isbn in books) {
    if (books[isbn].author === author) filteredBooks.push(books[isbn]);
  }
  res.send({ "booksByAuthor": filteredBooks });
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  let title = await req.params.title;
  let bookByTitle = [];

  for (const isbn in books) {
    if (books[isbn].title === title) {
      bookByTitle.push({
        "isbn": isbn,
        "author": books[isbn].author,
        "reviews": books[isbn].reviews,
      });
    };
  }

  res.send({ "booksByTitle": bookByTitle });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  let isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
