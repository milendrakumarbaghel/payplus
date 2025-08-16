const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const rootRouter = require('./routes/routes');

// Middleware
const allowedOrigins = [
  "http://localhost:5173",           // React dev
  "https://payplus-nu.vercel.app"    // Your deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // if using cookies/auth headers
  })
);
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
