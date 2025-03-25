// Beveiligingshelper voor de applicatie
import crypto from 'crypto';
import { jwtDecode } from 'jwt-decode';

// Functie om een JWT token te valideren
export const validateToken = (token) => {
  try {
    if (!token) return false;
    
    // Decodeer de token om de vervaldatum te controleren
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    // Controleer of de token is verlopen
    if (decoded.exp < currentTime) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Token validatie fout:', error);
    return false;
  }
};

// Functie om een veilige hash te genereren
export const generateHash = (data, salt = '') => {
  return crypto
    .createHash('sha256')
    .update(data + salt)
    .digest('hex');
};

// Functie om een CSRF token te genereren
export const generateCSRFToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Functie om een veilige wachtwoordsterkte te controleren
export const checkPasswordStrength = (password) => {
  // Minimaal 8 tekens
  if (password.length < 8) {
    return {
      valid: false,
      message: 'Wachtwoord moet minimaal 8 tekens bevatten'
    };
  }
  
  // Moet minimaal één hoofdletter bevatten
  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      message: 'Wachtwoord moet minimaal één hoofdletter bevatten'
    };
  }
  
  // Moet minimaal één kleine letter bevatten
  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      message: 'Wachtwoord moet minimaal één kleine letter bevatten'
    };
  }
  
  // Moet minimaal één cijfer bevatten
  if (!/[0-9]/.test(password)) {
    return {
      valid: false,
      message: 'Wachtwoord moet minimaal één cijfer bevatten'
    };
  }
  
  // Moet minimaal één speciaal teken bevatten
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return {
      valid: false,
      message: 'Wachtwoord moet minimaal één speciaal teken bevatten'
    };
  }
  
  return {
    valid: true,
    message: 'Wachtwoord is sterk'
  };
};

// Functie om input te sanitizen tegen XSS
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Functie om te controleren of een gebruiker toegang heeft tot een resource
export const hasPermission = (user, requiredRole) => {
  if (!user) return false;
  
  // Admin heeft toegang tot alles
  if (user.rol === 'admin') return true;
  
  // Readonly gebruiker heeft alleen toegang tot readonly resources
  if (user.rol === 'readonly' && requiredRole === 'readonly') return true;
  
  return false;
};

export default {
  validateToken,
  generateHash,
  generateCSRFToken,
  checkPasswordStrength,
  sanitizeInput,
  hasPermission
};
