import mongoose from "mongoose";

const ProstSchema = new mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  text: {
    type: String,
    required: true,
  },
  tags: {
    type: Array,
    default:[]
  },
  imageUrl: String,
  viewsCount: {
    type:Number,
    default:0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    required: true
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
},{
  timestamps:true
})
// ======== после запятой идет то что будет при создании сущности пользователя

// ======== Экспортирую модель user
export const PostModel = mongoose.model('Post', ProstSchema)
