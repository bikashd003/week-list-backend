import express from 'express';
import moment from 'moment';
import WeekListSchema from '../models/weekList.models.js';
import { isLoggedIn } from './Auth.routes.js';

const timeLeftRouter = express.Router();

timeLeftRouter.get('/all-list', isLoggedIn, async (req, res) => {
    const owner = req.user._id;

    try {
        const weekLists = await WeekListSchema.find({ owner });

        const response = weekLists.map((weekList) => {
            const createdAt = moment(weekList.createdAt);
            console.log(createdAt);
            const sevenDaysLater = createdAt.clone().add(7, 'days');
            console.log(sevenDaysLater);
            const timeLeft = sevenDaysLater.diff(moment(), 'seconds');
            console.log(timeLeft);
            const formattedTimeLeft = moment.utc(timeLeft * 1000).format('D[d]:H[h]:m[m]:s[s]');

            return {
                title: weekList.title,
                timeLeft: formattedTimeLeft
            };
        });

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default timeLeftRouter;
