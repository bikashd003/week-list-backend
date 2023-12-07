import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
    taskName: {
        type: String,
        required: true,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    }
});

const WeekListSchema = new mongoose.Schema({
    tasks: [TaskSchema],
    title: {
        type: String,
        required: true
    },
    isFinished: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
});
export default mongoose.model('WeekList', WeekListSchema);











/*

// Define a pre-save hook to generate the default title
WeekListSchema.pre('save', async function (next) {
    if (!this.title) {
        const lastWeekList = await this.constructor.findOne({}, {}, { sort: { 'createdAt': -1 } });
        const lastTitle = lastWeekList ? lastWeekList.title : null;

        if (lastTitle) {
            const numericSuffix = parseInt(lastTitle.replace(/^\D+/g, ''), 10);
            this.title = `WeekList ${numericSuffix + 1}`;
        } else {
            this.title = 'WeekList 1';
        }
    }

    next();
});
*/