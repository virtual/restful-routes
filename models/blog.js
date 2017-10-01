var mongoose = require('mongoose');

// it's a constructor! capitalize it
var BlogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now }
});


// export it! Good to make singular
module.exports = mongoose.model('Blog', BlogSchema);