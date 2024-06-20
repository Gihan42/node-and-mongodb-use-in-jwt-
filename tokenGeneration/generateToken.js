require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.createAccessToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_KEY, {
    expiresIn: '15m', // Access token expires in 15 minutes
  });
};

module.exports.createRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.REFRESH_TOKEN_KEY, {
    expiresIn: '7d', // Refresh token expires in 7 days
  });
};
