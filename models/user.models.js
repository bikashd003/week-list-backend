import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    age:{
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        required: true,
        enum: ["male", "female"]
    },
    phone: {
        type: Number,
        required: true,
    },
    weeklist:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "WeekList"
        }
    ]

}, { timestamps: true })
export default mongoose.model("User", UserSchema);