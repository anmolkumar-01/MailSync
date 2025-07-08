import express from 'express'
import {errorHandler} from './utils/errorHandler.js'
import cookieParser from "cookie-parser"

const app = express()

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({extended: true , limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/user", authRoutes)

app.use(errorHandler)
export {app}