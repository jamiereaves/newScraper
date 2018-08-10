var express = require("express");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));
// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Connect to the Mongo DB
//mongoose.connect("mongodb://localhost/newScraper");
// If deployed, use the deployed database. Otherwise use the local newScraper database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newScraper";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// Routes

// Load index page
app.get("/", function(req, res) {
  db.Article.find({"saved":"false"}).then(function(result) {
    if(result===null){
      console.log("you have no new jobs");
      console.log(result);
    }
    res.render("index", {
      Article: result
    });
    console.log(result);
  });
}); 

// Load saved articles
app.get("/articles/saved", function(req, res) {
  db.Article.find({"saved":"true"}).then(function(result) {
    if(result===null){
      console.log("you have no saved jobs")
      console.log(result);
    }
    res.render("saved", {
      Article: result
    });
    console.log(result);
  })
})

// Load comments
app.get("/comments/:id", function(req, res) {
  db.Comment.find({"articleID": req.params.id}).then(function(result) {
    if(result===null){
      console.log("there are no comments")
      console.log(result);
    }
    res.render("comments", {
      Comment: result
    });
    console.log(result);
  })
})

// A GET route for scraping the new york times food webpage
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  axios.get("http://www.nytimes.com/section/food").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
    // Now, we grab every h2 within an article tag, and do the following:
    $("article.story").each(function(i, element) {
      // Save an empty result object
      var result = {};
      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("div.story-body")
        .children("h2.headline")
        .children("a")
        .text();
      result.summary = $(this)
        .children("div.story-body")
        .children("p.summary")
        .text();
      result.link = $(this)
        .children("div.story-body")
        .children("h2.headline")
        .children("a")
        .attr("href");
      result.imagelink = $(this)
        .children("figure.photo")
        .children("a")
        .children("img")
        .attr("src");
        
      console.log(result);
      
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
    });
});
res.send("Scrape Complete");
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/comments/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Comment.create(req.body)
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.put("/articles/saved/:id", function(req, res) {
  db.Article.update({_id: req.params.id}, {$set: {"saved":"true"}} )
  .then(function(dbArticle){
    res.json(dbArticle);
  })
  .catch(function(err) {
    res.json(err);
  })
})

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
