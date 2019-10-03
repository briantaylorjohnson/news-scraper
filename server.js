var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Packages required for scraping the best news
var axios = require("axios");
var cheerio = require("cheerio");

// Ensuring that all models are required
var db = require("./models");

// Sets a port for the app to be accessed on
var PORT = process.env.PORT || 3000;

// Initialization of Express so the frontend and backend can communicate
var app = express();

// Enables logging with the NPM logger package
app.use(logger("dev"));

// Parses all Express request bodies as JSON which is consumable by the services being invoked
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Makes the static public folder and its contents usable by the app
app.use(express.static("public"));

// Connect to the locally hosted MongoDB instance (or the one on Heroku when deployed)
mongoose.connect("mongodb://127.0.0.1:27017/news-scraper", { useNewUrlParser: true, useUnifiedTopology: true });

// Server API routing
// GET request for scraping news
app.get("/scrape_news", function(req, res)
{

    axios.get("https://sports.theonion.com").then(function(response)
    {
        var $ = cheerio.load(response.data);

        $(".cw4lnv-5").each(function(i, element)
        {
            var result = {};

            result.title = $(this).find("h1.cw4lnv-6").text();

            console.log("\n" + $(this).find("h1.cw4lnv-6").text());

            result.link = $(this).children("a").attr("href");

            console.log($(this).children("a").attr("href") + "\n");

            
            db.Article.create(result).then(function(dbArticle)
            {
                console.log(dbArticle);
            })
            .catch(function(err)
            {
                console.log(err);
            });
            
        });

        res.send("Success!");
    });
});

// GET request to retrieve articles stored in the database
app.get("/fetch_articles", function(req, res)
{
    db.Article.find().then(function(dbArticles)
    {
        res.json(dbArticles);
    })
    .catch(function(err)
    {
        res.json(err);
    });
});

// GET request to retreive notes for a specific article
app.get("/fetch_notes/:id", function(req, res)
{
    db.Note.find({article: req.params.id}).then(function(getNotes)
    {
        res.json(getNotes);
    }).catch(function(err)
    {
        res.json(err);
    });
});

// POST request to post a note for a specific article
app.post("/post_note", function(req, res)
{
    db.Note.create(req.body).then(function(postNote){}).then(function(postNote)
    {
        res.json("Note successfully posted!");
    }).catch(function(err)
    {
        res.json(err);
    });
});

// POST request to delete a note for a specific article
app.post("/delete_note/:id", function(req, res)
{
    db.Note.deleteOne({_id: req.params.id}).then(function(deleteNote)
    {
        res.json("Note deleted successfully!");
    }).catch(function(err)
    {
        res.json(err);
    });
});

// This will start the server
app.listen(PORT, function()
{
    console.log("App running on port " + PORT + "!");
});