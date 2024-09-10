const { verifyToken } = require("../utils/jwt.js");

const Auth = (req, res, next) => {
  const Token = req.headers["authorization"]?.split(" ")[1];

  if (!Token) {
    return res
      .status(401)
      .json({ message: "Access denied, no token provided." });
  }

  try {
    const verified = verifyToken(Token);
    req.user = verified;
    next();
  } catch (err) {
    return res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = { Auth };
