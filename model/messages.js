var mongoose = require('mongoose'),
  Schema = mongoose.Schema
var messageSchema = new mongoose.Schema({
  name: String,
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  dob: {
    type: Date,
    default: Date.now
  },
});
mongoose.model('message', messageSchema);
