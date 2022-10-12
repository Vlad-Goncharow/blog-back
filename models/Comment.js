import mongoose from "mongoose";

const commentShema = new mongoose.Schema({
  text:{
    require:true,
    type:String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
}, {
  timestamps: true
})

export const CommentModel = mongoose.model('Comment', commentShema)