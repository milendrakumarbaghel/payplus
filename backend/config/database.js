const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/payment-db';

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 10000,
    retryWrites: true,
  };

const connectToDatabase = async () => {
    try {
      await mongoose.connect(MONGODB_URL, options);
      console.log('✅ Connected to MongoDB successfully');
    } catch (error) {
      console.error('❌ Error connecting to MongoDB:', error.message);
      console.log('Retrying connection in 5 seconds...');
      setTimeout(connectToDatabase, 5000);
     // Retry after 5 seconds
    }
  };

  module.exports = connectToDatabase;
