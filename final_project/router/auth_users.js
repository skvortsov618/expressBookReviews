const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: username
    }, 'access', { expiresIn: 60*60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
    const isbn = req.params.isbn;
    if (!books[isbn]) {
        res.send(`Book with isbn ${isbn} don't exist`)
    }
    if (books[isbn].reviews[req.user]) { 
        books[isbn].reviews[req.user] = req.body.review
        res.send(`Review for book with isbn ${isbn} updated.`);
    }
    else{
        books[isbn].reviews[req.user] = req.body.review
        res.send(`Review for book with isbn ${isbn} created`);
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    if (!books[isbn]) {
        res.send(`Book with isbn ${isbn} don't exist`)
    }
    if (!books[isbn].reviews[req.user]) {
        res.send(`Review not found`)
    } else {
    // if (books[isbn].reviews[req.user]) { 
        delete books[isbn].reviews[req.user]
        res.send(`Review for book with isbn ${isbn} deleted.`);
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
