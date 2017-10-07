var express = require('express');
var app = express();
var expressSanitizer = require('express-sanitizer');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Blog = require('./models/blog'); // singular!
var moment = require("moment");
var methodOverride = require("method-override");

mongoose.connect('mongodb://localhost/restful_blog_app');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('restful blog db has connected');
});




app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(expressSanitizer()); // must be after bodyparser
app.use(methodOverride("_method"));

app.get("/", function(req, res) {
  res.redirect("/blogs");
});
let allBlogs;
Blog.find({}, function(err, blogs){
  if (err) {
    console.log('error');
  } else {
    allBlogs = blogs;
  }
});

// INDEX - list all blogs
app.get("/blogs", function(req, res){
  Blog.find({}, function(err, blogs){
    if (err) {
      console.log('error');
    } else {
      res.render('index.ejs', {blogs: allBlogs, moment: moment});
    }
  });
});

// NEW - Show new blog form
app.get("/blogs/new", function(req, res) {
  res.render("new.ejs", {blogs: allBlogs});
});

// CREATE - Create a new post then redirect
app.post("/blogs", function(req, res) {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog, function(err, newBlog){
    if (err) {
      res.render("new");
    } else {
      res.redirect("/blogs");
    }
  });
});

// SHOW - Show info about one specific blog
app.get("/blogs/:id", function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog) {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.render("show.ejs", {blogs: allBlogs, blog: foundBlog, moment: moment})
    }
  }); 
});

// EDIT - Show edit form for one blog
app.get("/blogs/:id/edit", function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog) {
    if (err) {
      res.redirect('/blogs/:id');
    } else {
      res.render("edit.ejs", {blogs: allBlogs, blog: foundBlog})
    }
  }); 
});

// UPDATE - Update a particular post then redirect somewhere
app.put("/blogs/:id", function(req, res) {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.redirect("/blogs/"+ req.params.id);
    }
  });
});

// DELETE - Remove a particular post then redirect somewhere
app.delete("/blogs/:id", function(req, res) {
  Blog.findByIdAndRemove(req.params.id, req.body.blog, function(err, deletedBlog) {
    if (err) {
      res.redirect("/blogs/"+ req.params.id);
    } else {
      res.redirect("/blogs");
    }
  });
});


app.listen(5000, function(){
  console.log("listening on port 5000");
});