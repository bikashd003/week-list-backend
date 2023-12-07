import express from 'express';
import DbConnect from './Database/Db.js'
import dotenv from 'dotenv';
import {router} from './Routes/Auth.routes.js'
import NotFound from './middleware/NotFound.js'
import CreateRouter from './Routes/CreateList.routes.js'
import updateRouter from './Routes/UpdateList.routes.js';
import deleteRouter from './Routes/DeleteList.routes.js';
import FeedRouter from './Routes/Feed.routes.js';
import timeLeftRouter from './Routes/TimeLeftWeekList.routes.js';

dotenv.config({ path: "./.env" });
const app = express();
app.use(express.json());


app.get('/health', (req, res) => {
    const serverDetails = {
        serverTime: new Date().toLocaleString(),
        serverName: 'Week list server',
    }
    res.send(serverDetails);
});

DbConnect()
.then(() => {
    
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port ${process.env.PORT || 8000}`);
    });
    
})
.catch((err) => { "MongoDB connection error", err });
app.use('/api',router)
app.use('/api',CreateRouter)
app.use('/api',updateRouter)
app.use('/api',deleteRouter)
app.use('/api',FeedRouter)
app.use('/api',timeLeftRouter)
app.use(NotFound)

//to get local time
// const createdAt = new Date("2023-10-02T19:39:44.630+00:00");
// console.log(createdAt.toLocaleString());
