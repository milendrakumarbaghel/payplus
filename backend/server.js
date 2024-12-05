const express = require('express');
const app = express();
const rootRouter = require('./api/routes');
app.use("/api/v1", rootRouter);
