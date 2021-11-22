const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')
const userroute = require('./routes/users')
const authRoute = require('./routes/auth')
const postRoute = require('./routes/post')
dotenv.config()
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, function () {
    console.log('Database connected Successfully')
    app.listen(8800, function () {
        console.log('The server has started ')
    })
})
mongoose.Promise = global.Promise
//middleware
app.use(express.json())
app.use(helmet())
app.use(morgan('common'))
app.use("/api/users", userroute)
app.use('/api/auth', authRoute)
app.use('/api/posts', postRoute)
