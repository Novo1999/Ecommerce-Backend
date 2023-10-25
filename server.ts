import 'express-async-errors'
import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import mongoSanitize from 'express-mongo-sanitize'
import authRouter from './routes/auth.js'

dotenv.config()

const app = express()
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const port = process.env.PORT || 6700

app.use(morgan('dev'))
app.use(cors())
app.use(helmet())
app.use(mongoSanitize())

app.use('/api/e-commerce/auth', authRouter)

try {
  await mongoose.connect(process.env.MONGO_URL!)
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
  })
} catch (error) {
  console.log(error)
  process.exit(1)
}
