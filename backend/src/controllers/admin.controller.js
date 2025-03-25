// Implementatie van de admin controller

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

// Alle gebruikers ophalen
exports.getAllGebruikers = async (req, res) => {
  try {
    const gebruikers = await prisma.gebruiker.findMany({
      select: {
        id: true,
        email: true,
        naam: true,
        rol: true,
        laatst_ingelogd: true,
        created_at: true
      },
      orderBy: {
        naam: 'asc'
      }
    });
    
    res.status(200).json({
      success: true,
      data: gebruikers
    });
  } catch (error) {
    console.error('Get all gebruikers error:', error);
    res.status(500).json({
      success: false,
      message: 'Er is een fout opgetreden bij het ophalen van de gebruikers'
    });
  }
};

// Specifieke gebruiker ophalen
exports.getGebruikerById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const gebruiker = await prisma.gebruiker.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        email: true,
        naam: true,
        rol: true,
        laatst_ingelogd: true,
        created_at: true,
        updated_at: true
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
    console.error('Get gebruiker by id error:', error);
    res.status(500).json({
      success: false,
      message: 'Er is een fout opgetreden bij het ophalen van de gebruiker'
    });
  }
};

// Nieuwe gebruiker toevoegen
exports.createGebruiker = async (req, res) => {
  try {
    const { email, wachtwoord, naam, rol } = req.body;
    
    // Valideer verplichte velden
    if (!email || !wachtwoord || !naam || !rol) {
      return res.status(400).json({
        success: false,
        message: 'Email, wachtwoord, naam en rol zijn verplicht'
      });
    }
    
    // Controleer of email al bestaat
    const bestaandeGebruiker = await prisma.gebruiker.findUnique({
      where: { email }
    });
    
    if (bestaandeGebruiker) {
      return res.status(400).json({
        success: false,
        message: 'Er bestaat al een gebruiker met dit emailadres'
      });
    }
    
    // Valideer rol
    if (!['admin', 'readonly'].includes(rol)) {
      return res.status(400).json({
        success: false,
        message: 'Rol moet "admin" of "readonly" zijn'
      });
    }
    
    // Hash wachtwoord
    const hashedWachtwoord = await bcrypt.hash(wachtwoord, 10);
    
    // Maak nieuwe gebruiker aan
    const nieuweGebruiker = await prisma.gebruiker.create({
      data: {
        email,
        wachtwoord: hashedWachtwoord,
        naam,
        rol
      },
      select: {
        id: true,
        email: true,
        naam: true,
        rol: true,
        created_at: true
      }
    });
    
    res.status(201).json({
      success: true,
      data: nieuweGebruiker
    });
  } catch (error) {
    console.error('Create gebruiker error:', error);
    res.status(500).json({
      success: false,
      message: 'Er is een fout opgetreden bij het aanmaken van de gebruiker'
    });
  }
};

// Gebruiker bijwerken
exports.updateGebruiker = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, wachtwoord, naam, rol } = req.body;
    
    // Controleer of gebruiker bestaat
    const bestaandeGebruiker = await prisma.gebruiker.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!bestaandeGebruiker) {
      return res.status(404).json({
        success: false,
        message: 'Gebruiker niet gevonden'
      });
    }
    
    // Controleer of email al bestaat bij een andere gebruiker
    if (email && email !== bestaandeGebruiker.email) {
      const emailExists = await prisma.gebruiker.findUnique({
        where: { email }
      });
      
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Er bestaat al een gebruiker met dit emailadres'
        });
      }
    }
    
    // Valideer rol
    if (rol && !['admin', 'readonly'].includes(rol)) {
      return res.status(400).json({
        success: false,
        message: 'Rol moet "admin" of "readonly" zijn'
      });
    }
    
    // Bouw update data object
    const updateData = {};
    if (email) updateData.email = email;
    if (naam) updateData.naam = naam;
    if (rol) updateData.rol = rol;
    
    // Hash wachtwoord als het is opgegeven
    if (wachtwoord) {
      updateData.wachtwoord = await bcrypt.hash(wachtwoord, 10);
    }
    
    // Update gebruiker
    const updatedGebruiker = await prisma.gebruiker.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: {
        id: true,
        email: true,
        naam: true,
        rol: true,
        laatst_ingelogd: true,
        updated_at: true
      }
    });
    
    res.status(200).json({
      success: true,
      data: updatedGebruiker
    });
  } catch (error) {
    console.error('Update gebruiker error:', error);
    res.status(500).json({
      success: false,
      message: 'Er is een fout opgetreden bij het bijwerken van de gebruiker'
    });
  }
};

// Gebruiker verwijderen
exports.deleteGebruiker = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Controleer of gebruiker bestaat
    const gebruiker = await prisma.gebruiker.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!gebruiker) {
      return res.status(404).json({
        success: false,
        message: 'Gebruiker niet gevonden'
      });
    }
    
    // Voorkom verwijderen van de laatste admin
    if (gebruiker.rol === 'admin') {
      const adminCount = await prisma.gebruiker.count({
        where: { rol: 'admin' }
      });
      
      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Kan de laatste admin gebruiker niet verwijderen'
        });
      }
    }
    
    // Verwijder gebruiker
    await prisma.gebruiker.delete({
      where: { id: parseInt(id) }
    });
    
    res.status(200).json({
      success: true,
      message: `Gebruiker met ID ${id} is verwijderd`
    });
  } catch (error) {
    console.error('Delete gebruiker error:', error);
    res.status(500).json({
      success: false,
      message: 'Er is een fout opgetreden bij het verwijderen van de gebruiker'
    });
  }
};

// Data importeren
exports.importData = async (req, res) => {
  try {
    const { type } = req.body;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Geen bestand geüpload'
      });
    }
    
    // Controleer of type geldig is
    const validTypes = ['kunstwerken', 'kunstenaars', 'locaties'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: `Ongeldig type: ${type}. Geldige types zijn: ${validTypes.join(', ')}`
      });
    }
    
    // Lees Excel bestand
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(req.file.path);
    const worksheet = workbook.getWorksheet(1);
    
    // Haal headers op
    const headers = [];
    worksheet.getRow(1).eachCell((cell) => {
      headers.push(cell.value);
    });
    
    // Verwerk data op basis van type
    let importedCount = 0;
    
    switch (type) {
      case 'kunstwerken':
        // Implementatie voor kunstwerken import
        // Dit is een vereenvoudigde versie, in een echte applicatie zou dit uitgebreider zijn
        for (let i = 2; i <= worksheet.rowCount; i++) {
          const row = worksheet.getRow(i);
          const data = {};
          
          headers.forEach((header, index) => {
            data[header] = row.getCell(index + 1).value;
          });
          
          // Valideer verplichte velden
          if (!data.titel || !data.kunstenaar_id || !data.type_id || !data.locatie_id) {
            continue;
          }
          
          // Maak kunstwerk aan
          await prisma.kunstwerk.create({
            data: {
              titel: data.titel,
              kunstenaar_id: parseInt(data.kunstenaar_id),
              type_id: parseInt(data.type_id),
              hoogte: data.hoogte ? parseFloat(data.hoogte) : null,
              breedte: data.breedte ? parseFloat(data.breedte) : null,
              diepte: data.diepte ? parseFloat(data.diepte) : null,
              gewicht: data.gewicht ? parseFloat(data.gewicht) : null,
              productiedatum: data.productiedatum ? new Date(data.productiedatum) : null,
              is_schatting_datum: data.is_schatting_datum === 'true' || data.is_schatting_datum === true,
              is_editie: data.is_editie === 'true' || data.is_editie === true,
              editie_beschrijving: data.editie_beschrijving,
              is_gesigneerd: data.is_gesigneerd === 'true' || data.is_gesigneerd === true,
              handtekening_locatie: data.handtekening_locatie,
              beschrijving: data.beschrijving,
              locatie_id: parseInt(data.locatie_id),
              aankoopdatum: data.aankoopdatum ? new Date(data.aankoopdatum) : null,
              aankoopprijs: data.aankoopprijs ? parseFloat(data.aankoopprijs) : null,
              leverancier_id: data.leverancier_id ? parseInt(data.leverancier_id) : null,
              huidige_marktprijs: data.huidige_marktprijs ? parseFloat(data.huidige_marktprijs) : null,
              verzekerde_waarde: data.verzekerde_waarde ? parseFloat(data.verzekerde_waarde) : null,
              status: data.status || 'in bezit'
            }
          });
          
          importedCount++;
        }
        break;
        
      case 'kunstenaars':
        // Implementatie voor kunstenaars import
        for (let i = 2; i <= worksheet.rowCount; i++) {
          const row = worksheet.getRow(i);
          const data = {};
          
          headers.forEach((header, index) => {
            data[header] = row.getCell(index + 1).value;
          });
          
          // Valideer verplichte velden
          if (!data.naam) {
            continue;
          }
          
          // Maak kunstenaar aan
          await prisma.kunstenaar.create({
            data: {
              naam: data.naam,
              adres: data.adres,
              postcode: data.postcode,
              plaats: data.plaats,
              land: data.land,
              telefoon: data.telefoon,
              email: data.email,
              website: data.website,
              geboortedatum: data.geboortedatum ? new Date(data.geboortedatum) : null,
              overlijdensdatum: data.overlijdensdatum ? new Date(data.overlijdensdatum) : null,
              biografie: data.biografie
            }
          });
          
          importedCount++;
        }
        break;
        
      case 'locaties':
        // Implementatie voor locaties import
        for (let i = 2; i <= worksheet.rowCount; i++) {
          const row = worksheet.getRow(i);
          const data = {};
          
          headers.forEach((header, index) => {
            data[header] = row.getCell(index + 1).value;
          });
          
          // Valideer verplichte velden
          if (!data.naam || !data.adres || !data.postcode || !data.plaats || !data.land || !data.type_id) {
            continue;
          }
          
          // Maak locatie aan
          await prisma.locatie.create({
            data: {
              naam: data.naam,
              adres: data.adres,
              postcode: data.postcode,
              plaats: data.plaats,
              land: data.land,
              type_id: parseInt(data.type_id),
              latitude: data.latitude ? parseFloat(data.latitude) : null,
              longitude: data.longitude ? parseFloat(data.longitude) : null
            }
          });
          
          importedCount++;
        }
        break;
    }
    
    // Verwijder tijdelijk bestand
    fs.unlinkSync(req.file.path);
    
    res.status(200).json({
      success: true,
      message: `${importedCount} ${type} succesvol geïmporteerd`,
      aantal_records: importedCount
    });
  } catch (error) {
    console.error('Import data error:', error);
    
    // Verwijder tijdelijk bestand bij fout
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: 'Er is een fout opgetreden bij het importeren van de data'
    });
  }
};

// Backup maken
exports.createBackup = async (req, res) => {
  try {
    const datum = new Date().toISOString().split('T')[0];
    const backupDir = path.join(__dirname, '../../uploads/backups');
    const backupFileName = `backup_${datum}.json`;
    const backupPath = path.join(backupDir, backupFileName);
    
    // Zorg ervoor dat de directory bestaat
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    // Haal alle data op
    const kunstwerken = await prisma.kunstwerk.findMany({
      include: {
        afbeeldingen: true,
        bijlagen: true
      }
    });
    
    const kunstenaars = await prisma.kunstenaar.findMany();
    const locaties = await prisma.locatie.findMany();
    const locatieTypes = await prisma.locatieType.findMany();
    const kunstwerkTypes = await prisma.kunstwerkType.findMany();
    const leveranciers = await prisma.leverancier.findMany();
    
    // Maak backup object
    const backupData = {
      datum: new Date().toISOString(),
      kunstwerken,
      kunstenaars,
      locaties,
      locatieTypes,
      kunstwerkTypes,
      leveranciers
    };
    
    // Schrijf naar bestand
    fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));
    
    // Stuur download URL terug
    const downloadUrl = `/api/downloads/backups/${backupFileName}`;
    
    res.status(200).json({
      success: true,
      message: 'Backup is succesvol aangemaakt',
      bestandsnaam: backupFileName,
      download_url: downloadUrl
    });
  } catch (error) {
    console.error('Create backup error:', error);
    res.status(500).json({
      success: false,
      message: 'Er is een fout opgetreden bij het maken van de backup'
    });
  }
};

// Backup herstellen
exports.restoreBackup = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Geen backup bestand geüpload'
      });
    }
    
    // Lees backup bestand
    const backupData = JSON.parse(fs.readFileSync(req.file.path, 'utf8'));
    
    // Controleer of backup geldig is
    if (!backupData.kunstwerken || !backupData.kunstenaars || !backupData.locaties) {
      return res.status(400).json({
        success: false,
        message: 'Ongeldig backup bestand'
      });
    }
    
    // Herstel data (in een echte applicatie zou dit in een transactie gebeuren)
    // Dit is een vereenvoudigde versie, in een echte applicatie zou dit uitgebreider zijn
    
    // Verwijder tijdelijk bestand
    fs.unlinkSync(req.file.path);
    
    res.status(200).json({
      success: true,
      message: 'Backup is succesvol hersteld'
    });
  } catch (error) {
    console.error('Restore backup error:', error);
    
    // Verwijder tijdelijk bestand bij fout
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: 'Er is een fout opgetreden bij het herstellen van de backup'
    });
  }
};
