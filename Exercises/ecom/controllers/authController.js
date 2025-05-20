const jwt = require('jsonwebtoken')
require('dotenv').config();

const db = require("../models");
const { use } = require('../routes/auth.route');
const { User } = db

// SIGNUP controller function
async function createUser(req, res) {
  try {
    let { first_name, last_name, email, password, role } = req.body;

    const user = await User.create({ first_name, last_name, email, password, role });
    const userWithoutPassword = await User.scope('defaultScope').findByPk(user.id);

    return res.status(201).json({ message: "User created successfully", data: userWithoutPassword });
  }
  catch (error) {
    //email duplication error
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        message: `Email address already exists. Please choose a different email.`,
      });
    }
    return res.status(500).json({ error: error });
  }
}


//LOGIN controller function
async function userLogin(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.scope('withPassword').findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: " User doesn't exists with this email" })
    }
    const isValid = await user.comparePassword(password);

    if (!isValid) {
      return res.status(400).json({ message: "Please enter the correct password" })
    }
    const payload = {
      id: user.id,
      role: user.role
    };

    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
    return res.status(200).json({
      message: "Login Successfull.", token: token, refreshToken: refreshToken, user: {
        id: user.id,
        role: user.role,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name
      }
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error })
  }
}

// REFRESH TOKEN controller function
async function refreshAccessToken(req, res) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired refresh token" });
      }

      const user = await User.findByPk(decoded.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Create a new access token
      const payload = {
        id: user.id,
        role: user.role
      };

      const newAccessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

      return res.status(200).json({
        message: "Access token refreshed",
        accessToken: newAccessToken
      });
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
}

module.exports = { createUser, userLogin, refreshAccessToken }