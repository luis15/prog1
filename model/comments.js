var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var commentSchema = new mongoose.Schema({
  content: String,
  message_id: {
    type: Schema.Types.ObjectId,
    ref: 'message'
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  dob: {
    type: Date,
    default: Date.now
  },
});
mongoose.model('comment', commentSchema);
