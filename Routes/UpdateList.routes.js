import express from 'express';
import { isLoggedIn } from './Auth.routes.js';
import WeekListSchema from '../models/weekList.models.js';
import Check24Hours from '../middleware/Check24Hours.js';

const updateRouter = express.Router();

updateRouter.patch('/update-list/:weekListId/:taskId', isLoggedIn,Check24Hours, async (req, res) => {
    const { weekListId, taskId } = req.params;

    try {
        const updatedList = await WeekListSchema.findOneAndUpdate(
            { _id: weekListId, 'tasks._id': taskId },
            { $set: { 'tasks.$.taskName': req.body.taskName} },
          
        );

        if (!updatedList) {
            return res.status(404).json({ message: 'WeekList or task not found' });
        }

        res.status(200).json(updatedList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default updateRouter;
