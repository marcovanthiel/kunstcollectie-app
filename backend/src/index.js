const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Laad omgevingsvariabelen
dotenv.config();

// Importeer routes
const authRoutes = require('./routes/auth.routes');
const kunstwerkenRoutes = require('./routes/kunstwerken.routes');
const kunstenaarsRoutes = require('./routes/kunstenaars.routes');
const locatiesRoutes = require('./routes/locaties.routes');
const rapportagesRoutes = require('./routes/rapportages.routes');
const adminRoutes = require('./routes/admin.routes');

// Initialiseer Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/kunstwerken', kunstwerkenRoutes);
app.use('/api/kunstenaars', kunstenaarsRoutes);
app.use('/api/locaties', locatiesRoutes);
app.use('/api/rapportages', rapportagesRoutes);
app.use('/api/admin', adminRoutes);

// Basis route
app.get('/', (req, res) => {
  res.json({ message: 'Welkom bij de Kunstcollectie Beheer API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Er is een fout opgetreden!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start de server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server draait op http://0.0.0.0:${PORT}`);
});

module.exports = app;
