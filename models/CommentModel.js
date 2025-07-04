const mongoose = require('mongoose');

// Comment Schema
const commentSchema = new mongoose.Schema({
  lead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LeadModel',  // Reference to the Lead model
    required: [true, 'Lead reference is required'],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SalesAgent',  // Reference to the SalesAgent who authored the comment
    required: [true, 'Author is required'],
  },
  commentText: {
    type: String,
    required: [true, 'Comment text is required'],
  },
  createdAt: {
    type: String,
    default: new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata"
          }),  // Automatically set the creation time
  }
});

module.exports = mongoose.model('Comment', commentSchema);
