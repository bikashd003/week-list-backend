import mongoose from "mongoose";

const DbName="User";

const connectDb=async()=>{
    try{
        const connect= await mongoose.connect(`${process.env.DB_URI}/${DbName}`);
        console.log("MongoDB Connection successfully");
    }
    catch(error){
        console.log("MongoDB connection Error:", error);
        process.exit(1);
    }
}

export default connectDb;