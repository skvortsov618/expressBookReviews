const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.get("/getusers", (req,res)=>{
    res.send(JSON.stringify(users,null,4))
})

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

public_users.post("/register", (req,res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
        } else {
        return res.status(404).json({message: "User already exists!"});    
        }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

let getBooks = new Promise((resolve, reject)=>{
    setTimeout(()=>{
        resolve( JSON.stringify(books,null,4))
    }, 3000)
})
// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  getBooks.then((value)=>res.send(value))
    // res.send(JSON.stringify(books,null,4)); // - before async/await
});

let getBookByISBN = (isbn) => { 
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve( JSON.stringify(books[isbn],null,4))
        }, 3000)
    })
}
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
    const isbn = req.params.isbn;
    getBookByISBN(isbn).then((value)=>res.send(value))
    // res.send(books[isbn]) // -before last tasks
});
  
let getBookByAuthor = (author) => { 
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            const result = []
            for (const [key, entry] of Object.entries(books)) {
                if (entry.author.includes(author)) {
                    result.push(entry)
                }
            }
            resolve( JSON.stringify(result))
        }, 3000)
    })
}
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const author = req.params.author;
  getBookByAuthor(author).then((value)=>res.send(value))
//   const result = []
//   for (const [key, entry] of Object.entries(books)) {
//     if (entry.author.includes(author)) {
//         result.push(entry)
//     }
//   }
//   res.send(JSON.stringify(result,null,4));
});

let getBookByTitle = (title) => { 
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            const result = []
            for (const [key, entry] of Object.entries(books)) {
                if (entry.title.includes(title)) {
                    result.push(entry)
                }
            }
            resolve( JSON.stringify(result))
        }, 3000)
    })
}
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const title = req.params.title;
  getBookByTitle(title).then((value)=>res.send(value))
//   const result = []
//   for (const [key, entry] of Object.entries(books)) {
//     if (entry.title.includes(title)) {
//         result.push(entry)
//     }
//   }
//   res.send(JSON.stringify(result,null,4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews)
});

module.exports.general = public_users;
