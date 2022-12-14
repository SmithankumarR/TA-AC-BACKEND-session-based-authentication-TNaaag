var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var articleSchema = new Schema({
    title : {type : String, required:true},
    description : {type : String, required: true},
    tags : [String],
    author: String,
    comments: [{type: Schema.Types.ObjectId, ref: "Comment"}],
    likes : {type : Number, default: 0},
},{timeStamps: true});

module.exports = mongoose.model("Article", articleSchema);
