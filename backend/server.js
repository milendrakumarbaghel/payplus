const express = require('express');
const cors = require('cors');
require('dotenv').config();
app.use(cors());
app.use(express.json);
const rootRouter = require('./api/routes');
const app = express();

app.use("/api/v1", rootRouter);
app.listen(process.env.PORT || 8000);
