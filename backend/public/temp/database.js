import mongoose from "mongoose"


const connectDB = async()=>{
    try {
        
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI, {dbName: "bulk-email"})
        console.log(`\nMongoDB connected !! DB HOST : ${connectionInstance.connection.host}`)
    } catch (error) {
        console.error("Error in connecting to mongoDB" , error)

        process.exit(1) // Hey, something went wrong (DB connection failed), don’t continue running the server. Shut everything down!
    }
}

export default connectDB