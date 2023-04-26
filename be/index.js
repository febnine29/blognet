const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

const postsRouter = require('./routes/posts.router')
const authRouter = require('./routes/auth.router')
const commentsRouter = require('./routes/comments.router')
const likesRouter = require('./routes/likes.router')
const childrenRouter = require('./routes/childrenCmt.router')
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors())
app.use('/api/v1/posts', postsRouter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/comments', commentsRouter)
app.use('/api/v1/likes', likesRouter)
app.use('/api/v1/childrenCmt', childrenRouter)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log("-----SERVER IS RUNNING...")
})