const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const { User } = require('../models/userSchema');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const { Account } = require('../models/accountSchema');

exports.googleSignin = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, given_name, family_name } = payload;

    if (!email) {
      return res.status(400).json({ error: 'Email is required from Google token' });
    }

    let user = await User.findOne({ username: email });

    if (!user) {
      user = new User({
        username: email,
        password: 'google_oauth', // Consider hashing or replacing if needed
        firstName: given_name || 'First',
        lastName: family_name || 'Last',
      });

      await user.save();
    }

    const userId = user._id;

    userBankAccount = await Account.create({
      userId,
      balance: Math.floor(Math.random() * (100000 - 10000 + 1)) + 10000,
    });

    const jwtToken = jwt.sign(
      {
        userId,
      },
      process.env.JWT_SECRET
    );

    return res.status(200).json({
      msg: "User Created",
      token: jwtToken,
      userId: userId,
      firstName: user.firstName,
    });
  } catch (err) {
    console.error('Google auth error:', err.message);
    res.status(401).json({ error: 'Invalid Google token or configuration' });
  }
};
