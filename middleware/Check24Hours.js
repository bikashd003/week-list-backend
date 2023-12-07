import weekListSchema from '../models/weekList.models.js'
const Check24Hours=async (req,res,next)=>{
    try {
        const { weekListId } = req.params;

        const weekListToDelete = await weekListSchema.findById(weekListId);

        if (!weekListToDelete) {
            return res.status(404).json({ message: "List not found" });
        }

        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        if (!weekListToDelete.createdAt || weekListToDelete.createdAt < twentyFourHoursAgo) {
            return res.status(403).json({ message: "Cannot update and delete the list beyond 24 hours" });
        }

        next(); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export default Check24Hours;