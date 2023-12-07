import weekListSchema from '../models/weekList.models.js'
const Check7Days=async (req,res,next)=>{
    try {
        const { weekListId } = req.params;

        const weekListToDelete = await weekListSchema.findById(weekListId);

        if (!weekListToDelete) {
            return res.status(404).json({ message: "List not found" });
        }

        const sevenDaysAgo = new Date(Date.now() -7* 24 * 60 * 60 * 1000);
        if (!weekListToDelete.createdAt || weekListToDelete.createdAt <= sevenDaysAgo) {
            return res.status(403).json({ message: "You ran out of time to mark and unmark the task" });
        }

        next(); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export default Check7Days;