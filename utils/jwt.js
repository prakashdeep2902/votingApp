const jwt = require("jsonwebtoken");
const secKey = process.env.jwtSecretKey;

const genrateToken = (data) => {
  return jwt.sign(data, secKey, { expiresIn: "1d" });
};

const verifyToken = (token) => {
  return jwt.verify(token, secKey);
};

module.exports = { genrateToken, verifyToken };
