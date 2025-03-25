// Implementatie van de auth controller met JWT authenticatie

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Login functie
exports.login = async (req, res) => {
  try {
    const { email, wachtwoord } = req.body;
    
    // Valideer input
    if (!email || !wachtwoord) {
      return res.status(400).json({
        success: false,
        message: 'Email en wachtwoord zijn verplicht'
      });
    }
    
    // Zoek gebruiker op email
    const gebruiker = await prisma.gebruiker.findUnique({
      where: { email }
    });
    
    // Controleer of gebruiker bestaat
    if (!gebruiker) {
      return res.status(401).json({
        success: false,
        message: 'Ongeldige inloggegevens'
      });
    }
    
    // Controleer wachtwoord
    const isWachtwoordCorrect = await bcrypt.compare(wachtwoord, gebruiker.wachtwoord);
    if (!isWachtwoordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Ongeldige inloggegevens'
      });
    }
    
    // Update laatst ingelogd
    await prisma.gebruiker.update({
      where: { id: gebruiker.id },
      data: { laatst_ingelogd: new Date() }
    });
    
    // Genereer JWT token
    const token = jwt.sign(
      { id: gebruiker.id, email: gebruiker.email, rol: gebruiker.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    // Stuur response
    res.status(200).json({
      success: true,
      token,
      user: {
        id: gebruiker.id,
        email: gebruiker.email,
        naam: gebruiker.naam,
        rol: gebruiker.rol
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Er is een fout opgetreden bij het inloggen'
    });
  }
};

// Logout functie (client-side implementatie)
exports.logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Succesvol uitgelogd'
  });
};

// Huidige gebruiker ophalen
exports.getCurrentUser = async (req, res) => {
  try {
    const gebruiker = await prisma.gebruiker.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        naam: true,
        rol: true,
        laatst_ingelogd: true
      }
    });
    
    if (!gebruiker) {
      return res.status(404).json({
        success: false,
        message: 'Gebruiker niet gevonden'
      });
    }
    
    res.status(200).json({
      success: true,
      data: gebruiker
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Er is een fout opgetreden bij het ophalen van de gebruiker'
    });
  }
};
