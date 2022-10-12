import ApiError from "../exceptions/ApiError.js"
import {
  PostModel
} from "../models/Post.js"
import {
  CommentModel
} from "../models/Comment.js"

class PostService {
  async create(title, text, imageUrl, tags, user) {
    const post = await PostModel.create({
      title,
      text,
      imageUrl,
      tags,
      user
    })
    return post
  }
  async getAllPosts() {
    const posts = await PostModel.find().populate('user', '-password').populate('comments').exec()
    return posts
  }
  async getPost(id) {
    const post = await PostModel.findOneAndUpdate({
        _id: id,
      }, {
        $inc: {
          viewsCount: 1
        }
      },
      // ======== После обновления хотим вернуть обновленный документ
      {
        returnDocument: "after"
      }).populate('user', '-password').populate({
      path: 'comments',
      populate: {
        path: 'user',
        select: '-password'
      }
    }).exec()
    return post
  }
  async getLastTags() {
    const posts = await PostModel.find().limit(5).populate('user', '-password').exec()
    const tags = posts.map(el => el.tags).flat().slice(0, 5)
    return tags
  }
  async getPostsByTag(name) {
    const posts = await PostModel.find({
      tags: name
    })
    return posts
  }
  async sendComment(text, userId, postId) {
    const comment = await CommentModel.create({
      text: text,
      user: userId,
      post: postId
    })
    const com = await CommentModel.findById(comment._id).populate('user', '-password').exec()

    await PostModel.findOneAndUpdate({
      _id: postId,
    }, {
      $push: {
        "comments": comment
      }
    })

    return com
  }
  async loadComments(postId) {
    const comments = await CommentModel.find({
      post: postId
    }).populate('user', '-password')
    return comments
  }
  async deletePost(postId) {
    const post = await PostModel.findByIdAndDelete(postId)
    post.comments.forEach(async(comment) => {
      await CommentModel.findByIdAndDelete(comment._id)
    })
    return post
  }
  async deleteComment(commentId) {
    const post = await CommentModel.findByIdAndRemove(commentId)
    return post
  }
  async updatePost(postId,values) {
    const post = await PostModel.findOneAndUpdate({
      _id: postId,
    }, {
      "title": values.title,
      "text": values.text,
      "tags": values.tags,
      "imageUrl": values.imageUrl,
    })
    return post
  }
  async getPostByEmail(userId) {
    const posts = await PostModel.find({user:userId}).populate('user', '-password').populate('comments').exec()
    return posts
  }
  async updateComment(commentId,text){
    await CommentModel.updateOne({
      _id:commentId
    },{
      text:text
    })

    return {
      succes:true
    }
  }
  async getLastPosts() {
    const posts = await PostModel.find().sort({createdAt:-1}).populate('user', '-password').populate('comments').exec()
    return posts
  }
  async getPopularPosts() {
    const posts = await PostModel.find().sort({viewsCount:-1}).populate('user', '-password').populate('comments').exec()
    return posts
  }
}

export default new PostService()