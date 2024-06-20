const express = require("express");
const jwt = require("jsonwebtoken");
const { createAccessToken } = require("../tokenGeneration/generateToken");

const router = express.Router();

router.post("/refresh-token", (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return res.status(401).json({ message: "Refresh Token Not Found" });
  }

  jwt.verify(token, process.env.REFRESH_TOKEN_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid Refresh Token" });
    }
    
    const accessToken = createAccessToken(user.id);
    res.json({ accessToken });
  });
});

module.exports = router;
