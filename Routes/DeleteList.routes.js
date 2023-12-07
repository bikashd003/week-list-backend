import express from 'express';
import weekListSchema from '../models/weekList.models.js'
import userModels from '../models/user.models.js';
import { isLoggedIn } from './Auth.routes.js';
import Check24Hours from '../middleware/Check24Hours.js';
const deleteRouter = express.Router();

deleteRouter.delete('/delete-list/:weekListId/:taskId',Check24Hours, isLoggedIn, async (req, res) => {
    const { weekListId, taskId } = req.params;
    try {
        const deleteTask = await weekListSchema.findOneAndUpdate(
            { _id: weekListId },
            { $pull: { tasks: { _id: taskId } } },
            { new: true }
        );

        if (!deleteTask) {
            res.status(404).json({ message: "Task not found" })
        }

        res.status(200).json({ message: "Task deleted successfully" })

    } catch (error) {
        res.status(500).send(error)
    }
})
deleteRouter.delete('/delete-list/:weekListId', isLoggedIn,Check24Hours, async (req, res) => {
    const { weekListId } = req.params;
    try {
        const deleteList = await weekListSchema.findOneAndDelete({ _id: weekListId })
        if (!deleteList) {
            res.status(404).json({ message: "List not found" })
        }
        else {
            const owner = req.user._id;
            const updatedUser = await userModels.findByIdAndUpdate(
                owner,
                { $pull: { weeklist: weekListId } },
                { new: true }
            ).populate('weeklist');
            
            if (!updatedUser) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json({ message: "List deleted successfully" })
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" }, error)
    }

})


export default deleteRouter;