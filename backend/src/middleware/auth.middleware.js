// Middleware voor authenticatie en autorisatie

const jwt = require('jsonwebtoken');

// Middleware om te controleren of een gebruiker is ingelogd
exports.isAuthenticated = (req, res, next) => {
  try {
    // Haal de token op uit de Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Geen authenticatie token gevonden'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verifieer de token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Voeg de gebruiker toe aan het request object
    req.user = decoded;
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Ongeldige token'
    });
  }
};

// Middleware om te controleren of een gebruiker admin rechten heeft
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.rol === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Toegang geweigerd. Admin rechten vereist.'
    });
  }
};
