const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/payment-db';

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 10000,
    retryWrites: true,
  };

const connectToDatabase = async () => {
    try {
      await mongoose.connect(MONGODB_URI, options);
      console.log('✅ Connected to MongoDB successfully');
    } catch (error) {
      console.error('❌ Error connecting to MongoDB:', error.message);
      console.log('Retrying connection in 5 seconds...');
      setTimeout(connectToDatabase, 5000); // Retry after 5 seconds
    }
  };

  connectToDatabase();

  // Create a Schema for Users
  const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }
  });

  // Create a model from the schema
  const User = mongoose.model('User', userSchema);


  module.exports = {
    User
  };
