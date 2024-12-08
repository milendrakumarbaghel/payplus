const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json);
const rootRouter = require('./api/routes');

app.use("/api/v1", rootRouter);
app.listen(process.env.PORT || 8000);
