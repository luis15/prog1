var mongoose = require('mongoose');
var messageSchema = new mongoose.Schema({
  name: String,
  dob: { type: Date, default: Date.now },
});
mongoose.model('message', messageSchema);
