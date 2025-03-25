// Middleware voor bestandsupload

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configureer opslag voor kunstwerk afbeeldingen
const kunstwerkAfbeeldingenStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/kunstwerken');
    
    // Maak de directory aan als deze nog niet bestaat
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Genereer unieke bestandsnaam met timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'kunstwerk-' + uniqueSuffix + ext);
  }
});

// Configureer opslag voor kunstwerk bijlagen
const kunstwerkBijlagenStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/bijlagen');
    
    // Maak de directory aan als deze nog niet bestaat
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Genereer unieke bestandsnaam met timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'bijlage-' + uniqueSuffix + ext);
  }
});

// Configureer opslag voor kunstenaar portretfoto's
const kunstenaarPortretStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/kunstenaars');
    
    // Maak de directory aan als deze nog niet bestaat
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Genereer unieke bestandsnaam met timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'portret-' + uniqueSuffix + ext);
  }
});

// Filter voor toegestane afbeeldingsbestanden
const afbeeldingFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Alleen afbeeldingsbestanden (jpeg, jpg, png, gif, webp) zijn toegestaan!'));
  }
};

// Filter voor toegestane documentbestanden
const documentFilter = (req, file, cb) => {
  const allowedTypes = /pdf|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  
  if (extname) {
    return cb(null, true);
  } else {
    cb(new Error('Alleen PDF en DOCX bestanden zijn toegestaan!'));
  }
};

// Exporteer de multer configuraties
exports.uploadKunstwerkAfbeelding = multer({
  storage: kunstwerkAfbeeldingenStorage,
  fileFilter: afbeeldingFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limiet
});

exports.uploadKunstwerkBijlage = multer({
  storage: kunstwerkBijlagenStorage,
  fileFilter: documentFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limiet
});

exports.uploadKunstenaarPortret = multer({
  storage: kunstenaarPortretStorage,
  fileFilter: afbeeldingFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limiet
});
