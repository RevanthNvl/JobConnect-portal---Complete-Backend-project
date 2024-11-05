// imports

// const express = require('express')
// we are not using the regular way of importing (using require), in this application we use module based approach, in package.json we add ("type": "module",) under main

//package imports
import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import cors from 'cors'
import morgan from 'morgan'

//file imports
import connectDB from './config/db.js'

//routes imports
import testRoutes from './routes/testRoutes.js'
import authRoutes from './routes/authRoutes.js'
import errorMiddleware from './middlewares/errorMiddleware.js'
import userRoutes from './routes/userRoutes.js'
import jobsRoutes from './routes/jobsRoute.js'

//dot env config
dotenv.config()

// mongodb connection
connectDB()

//rest object
const app = express()

//middlewares
app.use(express.json())
app.use(cors())
app.use(morgan("dev"))

//routes
app.get('/', (req, resp)=>{
    resp.send("<h1>Welcome to Job Portal</h1>")
})

app.use("/api/v1/test", testRoutes)
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/job', jobsRoutes)
// validation middleware

app.use(errorMiddleware)


//port
const PORT = process.env.PORT || 8080

//listen
app.listen(PORT, ()=>{
    console.log(`Node server is running on ${PORT} in ${process.env.DEV_MODE} mode`.bgWhite.black)
})
