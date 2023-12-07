import express from 'express';

const App = express()
App.get('/:notfound', async (req, res) => {
    res.status(404).send('not found')
})
export default App;