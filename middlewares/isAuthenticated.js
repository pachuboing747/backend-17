const passport = require('passport');

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    if (req.user.role === 'Customer' || req.user.role === 'Premium') {
    
      return next();
    }
  }

  res.status(401).json({ message: 'No estás autorizado para realizar esta acción.' });
}

module.exports = isAuthenticated;