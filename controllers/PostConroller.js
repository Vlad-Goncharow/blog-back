import PostService from "../services/PostService.js"

class PostConroller {
  async create(req, res, next) {
    try {
      const {
        title,
        text,
        imageUrl,
        tags,
      } = req.body
      const user = req.userId

      const post = await PostService.create(title, text, imageUrl, tags, user)
      res.json(post)
    } catch (e) {
      next(e)
    }
  }
  async getAllPosts(req, res, next) {
    try {
      const posts = await PostService.getAllPosts()
      res.json(posts)
    } catch (e) {
      next(e)
    }
  }
  async getPost(req, res, next) {
    try {
      const postId = req.params.id
      const post = await PostService.getPost(postId)
      res.json(post)
    } catch (e) {
      next(e)
    }
  }
  async getLastTags(req, res, next) {
    try {
      const tags = await PostService.getLastTags()
      res.json(tags)
    } catch (e) {
      next(e)
    }
  }
  async getPostsByTag(req, res, next) {
    try {
      const name = req.params.name
      const posts = await PostService.getPostsByTag(name)
      res.json(posts)
    } catch (e) {
      next(e)
    }
  }
  async sendComment(req, res, next) {
    try {
      const postId = req.params.id
      const {
        text
      } = req.body
      const userId = req.userId

      const post = await PostService.sendComment(text, userId, postId)

      res.json(post)
    } catch (e) {
      next(e)
    }
  }
  async loadComments(req, res, next) {
    try {
      const postId = req.params.id
      const comments = await PostService.loadComments(postId)
      res.json(comments)
    } catch (e) {
      next(e)
    }
  }
  async deletePost(req, res, next) {
    try {
      const postId = req.params.id

      const posts = await PostService.deletePost(postId)
      res.json(posts);
    } catch (e) {
      next(e)
    }
  }
  async deleteComment(req, res, next) {
    try {
      const commentId = req.params.id

      const post = await PostService.deleteComment(commentId)
      res.json(post)
    } catch (e) {
      next(e)
    }
  }
  async updatePost(req, res) {
    try{
      const id = req.params.id
      const values = req.body
      const post = await PostService.updatePost(id, values)
      res.json(post)
    } catch(e) {
      next(e)
    }
  }
  async getPostByEmail(req,res) {
    try{
      const userId = req.params.id
      const post = await PostService.getPostByEmail(userId)
      res.json(post)
    } catch(e) {

    }
  }
  async updateComment(req,res) {
    try{
      const commentId = req.params.id
      const {text} = req.body
      const comment = await PostService.updateComment(commentId, text)
      res.json(comment)
    } catch(e) {

    }
  }
  async getLastPosts(req, res, next) {
    try{
      const posts = await PostService.getLastPosts()
      res.json(posts)
    } catch(e) {
      next(e)
    }
  }
  async getPopularPosts(req,res,next) {
    try {
      const posts = await PostService.getPopularPosts()
      res.json(posts)
    }catch(e) {
      next(e)
    }
  }
}

export default new PostConroller()