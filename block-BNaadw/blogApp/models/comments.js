var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema(
  {
    text: { type: String, required: true },
    articleId: { type: Schema.Types.ObjectId, required: true, ref: 'articles' },
    author: { type: String, required: true },
    likes: { type: Number, default: 0 },
  },
  { timeStamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);
