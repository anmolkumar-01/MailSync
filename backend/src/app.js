import express from 'express'
import cors from 'cors'
import {errorHandler} from './utils/errorHandler.js'
import {resetDailyLimit} from './cron/resetDailyLimit.js' // no need to explicitly job.start() due to the fourth parameter to CronJob() starts the job automatically. I
import cookieParser from "cookie-parser"
import { app } from './services/socket.js'

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
import emailRoutes from "./routes/emails.route.js"

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/user", userRoutes)
app.use("/api/v1/org", organizationRoutes)
app.use("/api/v1/payment", paymentRoutes)
app.use("/api/v1/emails", emailRoutes)

app.use(errorHandler)
export {app}