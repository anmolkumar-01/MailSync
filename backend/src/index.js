import 'dotenv/config'
import { app } from "./app.js";
import connectDB from "./db/database.js";

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000 , ()=>{
        console.log(`Server is running on port: ${process.env.PORT}`);
    })
})
.catch((error)=>{
    console.log("App is not talking to Database !!")
})