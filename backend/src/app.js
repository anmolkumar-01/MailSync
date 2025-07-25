import express from 'express'
import cors from 'cors'
import {errorHandler} from './utils/errorHandler.js'
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: ['http://localhost:5173','https://mailsync-one.vercel.app'],
    credentials: true
}))


app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({extended: true , limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import organizationRoutes from "./routes/organization.route.js"
import paymentRoutes from "./routes/payment.route.js"

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/user", userRoutes)
app.use("/api/v1/organization", organizationRoutes)
app.use("/api/v1/payment", paymentRoutes)

app.use(errorHandler)
export {app}