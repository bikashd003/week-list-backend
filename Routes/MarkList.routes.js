import express from 'express';
import userModels from '../models/user.models';
import weekListSchema from '../models/weekList.models.js'
import Check7Days from '../middlewares/Check7Days.js';
import { isLoggedIn } from './Auth.routes';
const markRouter = express.Router()

markRouter.patch('mark-list/:weekListId/:taskId', isLoggedIn, Check7Days, async (req, res) => {
    const { weekListId, taskId } = req.params;
    try {
        const weekList = await weekListSchema.findById(weekListId)
        if (weekList.isFinished === "true") {
            return res.status(403).json({ message: "You can't mark a finished weeklist" })
        }
        const markTask = await weekListSchema.findOneAndUpdate(
            { _id: weekListId, 'tasks._id': taskId },
            { $set: { 'tasks.$.isCompleted': req.body.isCompleted } },
            { new: true }
        )
        if (!markTask) {
            return res.status(404).json({ message: 'WeekList or task not found' });
        }
        res.status(200).json(markTask)

    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})
markRouter.patch('mark-list/:weekListId', isLoggedIn, Check7Days, async (req, res) => {
    const { weekListId } = req.params;
    try {
        const markWeekList = await weekListSchema.findOneAndUpdate(
            { _id: weekListId },
            { $set: { isFinished: req.body.isCompleted } },
            { new: true }
        )
        if (!markWeekList) {
            return res.status(404).json({ message: 'WeekList or task not found' });
        }
        res.status(200).json(markWeekList)

    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})


export default markRouter;
