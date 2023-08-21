const express = require('express')
require('dotenv').config()
const cookieParser = require('cookie-parser')
const cors = require('cors')
const morgan = require("morgan");

const auth = require('./routes/auth')
const job = require('./routes/job')

// import routes
const { connectDB } = require('./utils/db')

const app = express()

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}))
app.use(express.json())
app.use(cookieParser())
app.use(morgan("dev"));

app.use('/auth', auth)
app.use('/jobs', job)

connectDB()
    .then(res => app.listen(process.env.PORT, () => {
        console.log(`Server listening on port ${process.env.PORT}`)
    }))
    .catch(err => console.log(err))