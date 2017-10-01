var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Blog = require('./models/blog'); // singular!

mongoose.connect('mongodb://localhost/restful_blog_app');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('restful blog db has connected');
});


app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true}));

Blog.create({
  title: "Having cocoa with Emily",
  image: "https://images.unsplash.com/reserve/F8x8NPwTQEmVdXOHjO8o_Espresso.jpg?dpr=1&auto=compress,format&fit=crop&w=1051&h=&q=80&cs=tinysrgb&crop=",
  body: "What a fun day to drink hot chocolate with lots of whipped cream!"
});

app.get("/", function(req, res) {
  res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
  Blog.find({}, function(err, blogs){
    if (err) {
      console.log('error');
    } else {
      res.render('index', {blogs: blogs});
    }
  });
});

app.listen(5000, function(){
  console.log("listening on port 5000");
});