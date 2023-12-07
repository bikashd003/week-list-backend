import express from 'express';
import WeekListSchema from '../models/weekList.models.js';
import userModels from '../models/user.models.js';
const CreateRouter = express.Router();
import { isLoggedIn } from './Auth.routes.js';

CreateRouter.post('/createlist', isLoggedIn, async (req, res) => {
  const { tasks, title } = req.body;
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  try {
    const owner = req.user._id;
    const allWeekLists = await WeekListSchema.find({ owner })
    const existingWeekListsCount = await WeekListSchema.countDocuments({
      owner: req.user._id,
      isFinished: false,
    });
    const existedWeekList = await WeekListSchema.findOne({ title });
    if (existedWeekList) {
      existedWeekList.tasks.push({ taskName: tasks });
      await existedWeekList.save();
      res.status(201).send("add another task");
    }
    else if (!existedWeekList && existingWeekListsCount < 2 && allWeekLists.createdAt <= sevenDaysAgo) {

      const newWeekList = new WeekListSchema({
        tasks: [{ taskName: tasks }],
        title,
        owner,
      });
      const savedWeekList = await newWeekList.save();

      await userModels.findOneAndUpdate(
        { _id: req.user._id },
        { $addToSet: { weeklist: savedWeekList._id } }
      );
      res.status(201).json(savedWeekList);
    }
    else if (!existedWeekList && existingWeekListsCount >= 2) {
      res.status(201).send("you can't create more than 2 week lists")
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default CreateRouter;
