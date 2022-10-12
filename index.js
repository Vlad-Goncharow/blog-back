import express from 'express'
import mongoose from 'mongoose'
import ErrorMeddleware from './middlewares/ErrorMeddleware.js'
import router from './router/index.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import dotenv from 'dotenv'
dotenv.config()


mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('server start'))
  .catch(e => console.log(e))

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000'
}))
app.use('/uploads', express.static('uploads'))

app.use(router)
app.use(ErrorMeddleware)

app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('server ok');
})
