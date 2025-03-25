// Middleware voor CSRF bescherming
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

// CSRF bescherming configuratie
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }
});

// Middleware voor CSRF bescherming
exports.setupCSRF = (app) => {
  // Cookie parser is nodig voor CSRF
  app.use(cookieParser());
  
  // CSRF bescherming toepassen op alle niet-GET routes
  app.use((req, res, next) => {
    // Skip CSRF voor bepaalde routes zoals login en API endpoints
    if (req.path === '/api/auth/login' || req.method === 'GET') {
      return next();
    }
    
    csrfProtection(req, res, next);
  });
  
  // CSRF token endpoint
  app.get('/api/csrf-token', csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
  });
};

// Rate limiting middleware
const rateLimit = require('express-rate-limit');

// Rate limiter configuratie
exports.setupRateLimiter = (app) => {
  // Algemene rate limiter
  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minuten
    max: 100, // max 100 requests per IP per 15 minuten
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: 'Te veel requests, probeer het later opnieuw'
    }
  });
  
  // Striktere rate limiter voor auth routes
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minuten
    max: 10, // max 10 login pogingen per IP per 15 minuten
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: 'Te veel login pogingen, probeer het later opnieuw'
    }
  });
  
  // Pas algemene rate limiter toe op alle routes
  app.use(generalLimiter);
  
  // Pas striktere rate limiter toe op auth routes
  app.use('/api/auth/login', authLimiter);
};

// Helmet middleware voor HTTP headers beveiliging
const helmet = require('helmet');

// Helmet configuratie
exports.setupHelmet = (app) => {
  app.use(helmet());
  
  // Content Security Policy configuratie
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https://via.placeholder.com"],
        connectSrc: ["'self'"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"]
      }
    })
  );
};

// XSS bescherming middleware
exports.setupXSSProtection = (app) => {
  // XSS filter inschakelen
  app.use(helmet.xssFilter());
  
  // Voorkom MIME type sniffing
  app.use(helmet.noSniff());
};

// CORS configuratie
const cors = require('cors');

// CORS configuratie
exports.setupCORS = (app) => {
  const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://projectkunst.nl'] 
      : ['http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
    credentials: true,
    maxAge: 86400 // 24 uur
  };
  
  app.use(cors(corsOptions));
};

// Logging middleware
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// Logging configuratie
exports.setupLogging = (app) => {
  // Ontwikkelomgeving logging
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }
  
  // Productieomgeving logging naar bestand
  if (process.env.NODE_ENV === 'production') {
    const logDir = path.join(__dirname, '../../logs');
    
    // Maak logs directory als deze nog niet bestaat
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    const accessLogStream = fs.createWriteStream(
      path.join(logDir, 'access.log'),
      { flags: 'a' }
    );
    
    app.use(morgan('combined', { stream: accessLogStream }));
  }
};

// Error handling middleware
exports.setupErrorHandling = (app) => {
  // 404 handler
  app.use((req, res, next) => {
    res.status(404).json({
      success: false,
      message: 'Endpoint niet gevonden'
    });
  });
  
  // Algemene error handler
  app.use((err, req, res, next) => {
    console.error('Server error:', err);
    
    // CSRF error
    if (err.code === 'EBADCSRFTOKEN') {
      return res.status(403).json({
        success: false,
        message: 'Ongeldige CSRF token'
      });
    }
    
    // Algemene error response
    const statusCode = err.statusCode || 500;
    const message = process.env.NODE_ENV === 'production' 
      ? 'Er is een fout opgetreden' 
      : err.message || 'Er is een fout opgetreden';
    
    res.status(statusCode).json({
      success: false,
      message
    });
  });
};
