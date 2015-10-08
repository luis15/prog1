var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
  name: String,
  created: Date.now;
});
mongoose.model('message', messageSchema);
