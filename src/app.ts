import express, { Application, Request, Response } from 'express'
import mongoose, { Schema } from 'mongoose'
import { eventsRouter } from './app/controllers/events.controller'
import { usersRouter } from './app/controllers/users.controller'
const morgan = require('morgan')
const cors = require('cors')

const app: Application = express()

// middleware 
app.use(express.json())
app.use(morgan("dev"))
app.use(
    cors({
        origin:[
            "http://localhost:5173",
            "https://eventt-hub.netlify.app"
        ],
        credentials:true
    })
)

// controllers 
app.use("/events",eventsRouter)
app.use("/users",usersRouter)


app.get('/', (req: Request, res: Response) => {
    res.json({
        status: true,
        message: "Server Working Finely 🎉"
    })
})



export default app

/**
 * Basic File Structure
 * server file - server handling like - starting, closing, error handling of server, only related to server
 * app file - route handling, middleware handle, route related error handle
 * app folder - app business login handling like create, delete, update, retrieve, database related works
 */