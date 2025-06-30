import mongoose from 'mongoose'
import { Server } from 'http'
import app from './app'
import dotenv from 'dotenv'
dotenv.config()


let server: Server
const PORT = process.env.RUNNING_PORT
const main = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASS}@cluster0.zwjr9aa.mongodb.net/EventHub?retryWrites=true&w=majority&appName=Cluster0`)

        console.log("Successfully Connected to MongoDB Using Mongoose 🎉")

        server = app.listen(PORT, () => {
            console.log(`Local Server listening on port ${PORT}`)
        })

    } catch (error) {
        console.log(error);
    }
}

main()