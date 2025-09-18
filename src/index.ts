import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors, { CorsOptionsDelegate, CorsRequest } from 'cors'
import { PrismaClient } from '@prisma/client'
dotenv.config()


const app = express()
const Port = process.env.PORT || 5000
const corsOptionDelegate: CorsOptionsDelegate = (req: CorsRequest, callback) => {
    const allowedOrigin = ['http://localhost:5173']
    const origin = req.headers.origin
    if (!origin || allowedOrigin.includes(origin)) {
        callback(null, {
            origin:true,
            credentials: true,
        })
    }
    else {
        callback(new Error("Not Allowed By Cors"), {
            origin:false,
        })
    }
}
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(cors(corsOptionDelegate))

app.get("/", (req, res) => {
    res.send("This Is An AI Project")
})
export const db = new PrismaClient()
app.listen(Port,() => {
    console.log(`Your Sever is running on http://localhost:${Port}`)
})