const express = require("express");
const { urlencoded } = require("express");
const app = express();
const fileUpload = require("express-fileupload");
const fs = require("fs");
app.use(fileUpload());
app.use(urlencoded({ extended: false }));

const cache = {}; // anytime user adds info in the form, it is pushed onto this cache.  cache is just an in-meomory store to quickly store and grab data
// each submission represents one additional element in the array.  eg four submissions means four elements i.e four object pairs, in this cache array

// app.use(express.static("public"));

app.get("/", (req, res, next) => {
  // next indicates the next middleware function
  console.log(cache);
  next();
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/pages/index.html");
});

app.get("/functions", (req, res) => {
  // the /functions refers back to the form.html The action attribute specifies where to send the form-data when a form is submitted.
  res.sendFile(__dirname + "/pages/form.html");
});

app.get("/:name", (req, res) => {
  console.log(req.params.name);
  if (cache[req.params.name]) {
    res.send(cache[req.params.name]);
  } else {
    fs.readFile(__dirname + "/public/" + req.params.name, {}, (err, data) => {
      if (err) {
        res.send("This file not in cache and not exists in public");
      } else {
        console.log("File found in public folder");
        res.send(data);
      }
    });
  }
});

app.post("/functions", (req, res) => {
  // the /functions refers to the form.html where user inputs the data
  // console.log(req.files.profile);
  console.log(req);
  fs.writeFile(
    __dirname + "/public/" + req.files.profile.name,
    req.files.profile.data,
    (err) => {
      if (err) console.log(err);
      else {
        console.log("File written successfully\n");
      }
    }
  );
  cache[req.files.profile.name] = req.files.profile.data; // the cache array will be updated with whatever user inputs
  console.log(cache);
  res.send("thanks for entering info buddy"); // the response the user sees on the page upon submitting the data
});

app.get("/information", (req, res) => {
  // will display all data entered from users stored in cache in the /information url
  res.send(cache);
});
app.get("/user/:name", (req, res) => {
  // the :name endpoint is a variable for any name the user inputs
  res.send("Welcome Back old buddy " + req.params.name); // will return whatever name is inputted in the url endpoint
});

app.get("/info/:index", (req, res) => {
  // the :index endpoint represents the index number of the element in the cache array the user is requesting for
  res.send(cache[req.params.index]); // will respond with the element data (in object format) with the same index number in the cache
});

app.post("/functions", (req, res) => {
  console.log(req.body);
  console.log(req.files.profile);
  fs.res.send("Login Information Received.");
});

app.listen(8000, () => {
  console.log("Application is now running on the 8000");
});
