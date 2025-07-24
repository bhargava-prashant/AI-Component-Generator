exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next(); // User is logged in
    }
    return res.status(401).json({ message: 'Unauthorized: Please login first.' });
  };
  