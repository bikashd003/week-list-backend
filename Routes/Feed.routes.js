import express from 'express';
import weekListSchema from '../models/weekList.models.js'
import { isLoggedIn } from './Auth.routes.js';

const FeedRouter = express.Router();

FeedRouter.get('/feed', isLoggedIn, async (req, res) => {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weekList = await weekListSchema.find({});
    if (!weekList.createdAt <= sevenDaysAgo) {
        return res.status(200).res.send(weekList);
    }
})
FeedRouter.get('/week-list/:weekListId', isLoggedIn, async (req, res) => {
    const { weekListId } = req.params;
    try {
        const weekList = await weekListSchema.find({ _id: weekListId });
        res.status(200).json(weekList);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }

})
export default FeedRouter;