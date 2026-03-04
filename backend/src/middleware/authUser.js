const jwt = require("jsonwebtoken");

const authUser = (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authorization token missing"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Only allow USER role
    if (!decoded.role || decoded.role.toUpperCase() !== "USER") {
      return res.status(403).json({
        message: "Access denied: User only"
      });
    }

    req.user = {
      userId: decoded.userId,
      email: decoded.email
    };

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};

module.exports = authUser;