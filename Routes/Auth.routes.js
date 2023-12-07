import express from 'express';
import userModels from '../models/user.models.js';
const router = express.Router();
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import WeekListSchema from '../models/weekList.models.js';


const isLoggedIn = (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}

router.get('/user', isLoggedIn, async (req, res) => {
    const List=await WeekListSchema.find({})
    res.send(List)
})

router.post('/signup', async (req, res) => {
    const { fullName, email, password, age, gender, phone } = req.body;
    try {
        const encryptedPassword = await bcrypt.hash(password, 10);
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '10d' })
        const user = new userModels({ fullName, email, password: encryptedPassword, age, gender, phone});
        await user.save();
        res.status(201).send({ message: "Register user successfully",token})
    }
    catch (err) {
        console.log("error to save user:", err);
        res.status(500).json({ message: "Internal server error" })
    }

})
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModels.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, { expiresIn: '10d' });
            return res.status(200).json({ message: "Login successfully", token })
        }
    }
    catch (err) {
        console.log("Failed to login", err);
    }

})



export { router, isLoggedIn };