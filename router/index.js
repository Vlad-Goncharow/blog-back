import {Router} from 'express'
import { registerValidation,postCreateValidation } from '../validations.js'
import UserController from '../controllers/UserController.js'

import valiationErrors from '../utils/handleValidationsErrors.js'
import PostConroller from '../controllers/PostConroller.js'

import { checkAuth } from '../utils/checkAuth.js' 

import fs from 'fs';
import multer from 'multer'


const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage
});

const router = new Router()

router.post('/auth/register', registerValidation, valiationErrors, UserController.register)
router.post('/auth/login', UserController.login)
router.post('/auth/logout', UserController.logout)
router.get('/auth/refresh', UserController.refresh)

router.get('/posts/last', PostConroller.getLastPosts)
router.get('/posts/popular', PostConroller.getPopularPosts)
// router.get('/posts/new', PostConroller.getPopularPosts)


router.get('/posts', PostConroller.getAllPosts)
router.get('/posts/tags', PostConroller.getLastTags)
router.get('/posts/tags/:name', PostConroller.getPostsByTag)
router.get('/posts/:id', PostConroller.getPost)

router.get('/posts/:id/load-comments',  PostConroller.loadComments)
router.get('/posts/user/:id', checkAuth, PostConroller.getPostByEmail)

router.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`
  })
})

router.delete('/posts/:id', checkAuth, PostConroller.deletePost)

// ======== мб все что связано с коментариями можно начинать не posts а comments и тд
router.delete('/comments/:id', checkAuth, PostConroller.deleteComment)


router.patch('/comments/:id', checkAuth, PostConroller.updateComment)


router.post('/posts/:id/update', checkAuth, PostConroller.updatePost)

router.post('/posts/:id/add-comment', checkAuth, PostConroller.sendComment)
router.post('/posts', checkAuth, postCreateValidation, valiationErrors, PostConroller.create)

export default router