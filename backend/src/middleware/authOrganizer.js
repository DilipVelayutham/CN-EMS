const jwt = require("jsonwebtoken");

const authOrganizer = (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authorization token missing"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    if (!decoded.role || decoded.role.toUpperCase() !== "ORGANIZER") {
      return res.status(403).json({
        message: "Access denied: Organizer only"
      });
    }

    req.organizer = {
      organizerId: decoded.userId,
      email: decoded.email
    };

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};

module.exports = authOrganizer;
