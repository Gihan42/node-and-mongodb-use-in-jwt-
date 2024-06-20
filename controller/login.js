const User = require("../database/model/user");
const bcrypt = require("bcrypt");

const env = require("dotenv");
const { createAccessToken, createRefreshToken } = require("../tokenGeneration/generateToken");

env.config();

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!(email && password)) {
    return res.status(400).json({ message: "All input is required" });
  }
  const user = await User.findOne({ email });
  if (!(user && (await bcrypt.compare(password, user.password)))) {
    return res.status(404).json({ message: "Invalid credentials" });
  }
  
  const accessToken = createAccessToken(user._id);
  const refreshToken = createRefreshToken(user._id);
  
  res.cookie("refreshToken", refreshToken, {
    domain: process.env.frontend_url,
    path: "/",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Cookie expires in 7 days
    secure: true,
    httpOnly: true,
    sameSite: "None",
  });

  res.json({ accessToken,refreshToken });
};

module.exports = login;
