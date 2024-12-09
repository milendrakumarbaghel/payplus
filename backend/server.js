const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const rootRouter = require('./api/routes');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1", rootRouter);
app.get('/', (req, res) => {
    res.send('Server is running');
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
