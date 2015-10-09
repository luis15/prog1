var mongoose = require('mongoose');
var messageSchema = new mongoose.Schema({
  name: String,
  user_id : String,
  dob: { type: Date, default: Date.now },
});
mongoose.model('message', messageSchema);
