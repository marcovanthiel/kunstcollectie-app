// Implementatie van de kunstwerken controller

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

// Alle kunstwerken ophalen
exports.getAllKunstwerken = async (req, res) => {
  try {
    // Query parameters voor filtering en paginering
    const { kunstenaar_id, type_id, locatie_id, status, page = 1, limit = 10 } = req.query;
    
    // Bouw filter object
    const where = {};
    if (kunstenaar_id) where.kunstenaar_id = parseInt(kunstenaar_id);
    if (type_id) where.type_id = parseInt(type_id);
    if (locatie_id) where.locatie_id = parseInt(locatie_id);
    if (status) where.status = status;
    
    // Bereken skip voor paginering
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Haal kunstwerken op met relaties
    const kunstwerken = await prisma.kunstwerk.findMany({
      where,
      include: {
        kunstenaar: {
          select: {
            id: true,
            naam: true
          }
        },
        kunstwerkType: {
          select: {
            id: true,
            naam: true
          }
        },
        locatie: {
          select: {
            id: true,
            naam: true
          }
        },
        afbeeldingen: {
          where: {
            is_hoofdafbeelding: true
          },
          take: 1
        }
      },
      skip,
      take: parseInt(limit),
      orderBy: {
        titel: 'asc'
      }
    });
    
    // Tel totaal aantal kunstwerken voor paginering
    const total = await prisma.kunstwerk.count({ where });
    
    res.status(200).json({
      success: true,
      data: kunstwerken,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get all kunstwerken error:', error);
    res.status(500).json({
      success: false,
      message: 'Er is een fout opgetreden bij het ophalen van de kunstwerken'
    });
  }
};

// Specifiek kunstwerk ophalen
exports.getKunstwerkById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const kunstwerk = await prisma.kunstwerk.findUnique({
      where: { id: parseInt(id) },
      include: {
        kunstenaar: true,
        kunstwerkType: true,
        locatie: true,
        leverancier: true,
        afbeeldingen: {
          orderBy: {
            is_hoofdafbeelding: 'desc'
          }
        },
        bijlagen: true
      }
    });
    
    if (!kunstwerk) {
      return res.status(404).json({
        success: false,
        message: 'Kunstwerk niet gevonden'
      });
    }
    
    res.status(200).json({
      success: true,
      data: kunstwerk
    });
  } catch (error) {
    console.error('Get kunstwerk by id error:', error);
    res.status(500).json({
      success: false,
      message: 'Er is een fout opgetreden bij het ophalen van het kunstwerk'
    });
  }
};

// Nieuw kunstwerk toevoegen
exports.createKunstwerk = async (req, res) => {
  try {
    const {
      titel,
      kunstenaar_id,
      type_id,
      hoogte,
      breedte,
      diepte,
      gewicht,
      productiedatum,
      is_schatting_datum,
      is_editie,
      editie_beschrijving,
      is_gesigneerd,
      handtekening_locatie,
      beschrijving,
      locatie_id,
      aankoopdatum,
      aankoopprijs,
      leverancier_id,
      huidige_marktprijs,
      verzekerde_waarde,
      status
    } = req.body;
    
    // Valideer verplichte velden
    if (!titel || !kunstenaar_id || !type_id || !locatie_id) {
      return res.status(400).json({
        success: false,
        message: 'Titel, kunstenaar, type en locatie zijn verplicht'
      });
    }
    
    // Maak nieuw kunstwerk aan
    const nieuwKunstwerk = await prisma.kunstwerk.create({
      data: {
        titel,
        kunstenaar_id: parseInt(kunstenaar_id),
        type_id: parseInt(type_id),
        hoogte: hoogte ? parseFloat(hoogte) : null,
        breedte: breedte ? parseFloat(breedte) : null,
        diepte: diepte ? parseFloat(diepte) : null,
        gewicht: gewicht ? parseFloat(gewicht) : null,
        productiedatum: productiedatum ? new Date(productiedatum) : null,
        is_schatting_datum: is_schatting_datum === 'true' || is_schatting_datum === true,
        is_editie: is_editie === 'true' || is_editie === true,
        editie_beschrijving,
        is_gesigneerd: is_gesigneerd === 'true' || is_gesigneerd === true,
        handtekening_locatie,
        beschrijving,
        locatie_id: parseInt(locatie_id),
        aankoopdatum: aankoopdatum ? new Date(aankoopdatum) : null,
        aankoopprijs: aankoopprijs ? parseFloat(aankoopprijs) : null,
        leverancier_id: leverancier_id ? parseInt(leverancier_id) : null,
        huidige_marktprijs: huidige_marktprijs ? parseFloat(huidige_marktprijs) : null,
        verzekerde_waarde: verzekerde_waarde ? parseFloat(verzekerde_waarde) : null,
        status: status || 'in bezit'
      }
    });
    
    res.status(201).json({
      success: true,
      data: nieuwKunstwerk
    });
  } catch (error) {
    console.error('Create kunstwerk error:', error);
    res.status(500).json({
      success: false,
      message: 'Er is een fout opgetreden bij het aanmaken van het kunstwerk'
    });
  }
};

// Kunstwerk bijwerken
exports.updateKunstwerk = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      titel,
      kunstenaar_id,
      type_id,
      hoogte,
      breedte,
      diepte,
      gewicht,
      productiedatum,
      is_schatting_datum,
      is_editie,
      editie_beschrijving,
      is_gesigneerd,
      handtekening_locatie,
      beschrijving,
      locatie_id,
      aankoopdatum,
      aankoopprijs,
      leverancier_id,
      huidige_marktprijs,
      verzekerde_waarde,
      status
    } = req.body;
    
    // Controleer of kunstwerk bestaat
    const bestaandKunstwerk = await prisma.kunstwerk.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!bestaandKunstwerk) {
      return res.status(404).json({
        success: false,
        message: 'Kunstwerk niet gevonden'
      });
    }
    
    // Update kunstwerk
    const updatedKunstwerk = await prisma.kunstwerk.update({
      where: { id: parseInt(id) },
      data: {
        titel,
        kunstenaar_id: kunstenaar_id ? parseInt(kunstenaar_id) : undefined,
        type_id: type_id ? parseInt(type_id) : undefined,
        hoogte: hoogte ? parseFloat(hoogte) : null,
        breedte: breedte ? parseFloat(breedte) : null,
        diepte: diepte ? parseFloat(diepte) : null,
        gewicht: gewicht ? parseFloat(gewicht) : null,
        productiedatum: productiedatum ? new Date(productiedatum) : null,
        is_schatting_datum: is_schatting_datum === 'true' || is_schatting_datum === true,
        is_editie: is_editie === 'true' || is_editie === true,
        editie_beschrijving,
        is_gesigneerd: is_gesigneerd === 'true' || is_gesigneerd === true,
        handtekening_locatie,
        beschrijving,
        locatie_id: locatie_id ? parseInt(locatie_id) : undefined,
        aankoopdatum: aankoopdatum ? new Date(aankoopdatum) : null,
        aankoopprijs: aankoopprijs ? parseFloat(aankoopprijs) : null,
        leverancier_id: leverancier_id ? parseInt(leverancier_id) : null,
        huidige_marktprijs: huidige_marktprijs ? parseFloat(huidige_marktprijs) : null,
        verzekerde_waarde: verzekerde_waarde ? parseFloat(verzekerde_waarde) : null,
        status
      }
    });
    
    res.status(200).json({
      success: true,
      data: updatedKunstwerk
    });
  } catch (error) {
    console.error('Update kunstwerk error:', error);
    res.status(500).json({
      success: false,
      message: 'Er is een fout opgetreden bij het bijwerken van het kunstwerk'
    });
  }
};

// Kunstwerk verwijderen
exports.deleteKunstwerk = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Controleer of kunstwerk bestaat
    const kunstwerk = await prisma.kunstwerk.findUnique({
      where: { id: parseInt(id) },
      include: {
        afbeeldingen: true,
        bijlagen: true
      }
    });
    
    if (!kunstwerk) {
      return res.status(404).json({
        success: false,
        message: 'Kunstwerk niet gevonden'
      });
    }
    
    // Verwijder gerelateerde bestanden
    for (const afbeelding of kunstwerk.afbeeldingen) {
      const bestandspad = path.join(__dirname, '../../', afbeelding.bestandspad);
      if (fs.existsSync(bestandspad)) {
        fs.unlinkSync(bestandspad);
      }
    }
    
    for (const bijlage of kunstwerk.bijlagen) {
      const bestandspad = path.join(__dirname, '../../', bijlage.bestandspad);
      if (fs.existsSync(bestandspad)) {
        fs.unlinkSync(bestandspad);
      }
    }
    
    // Verwijder kunstwerk en gerelateerde records
    await prisma.$transaction([
      prisma.kunstwerkAfbeelding.deleteMany({
        where: { kunstwerk_id: parseInt(id) }
      }),
      prisma.kunstwerkBijlage.deleteMany({
        where: { kunstwerk_id: parseInt(id) }
      }),
      prisma.kunstwerk.delete({
        where: { id: parseInt(id) }
      })
    ]);
    
    res.status(200).json({
      success: true,
      message: `Kunstwerk met ID ${id} is verwijderd`
    });
  } catch (error) {
    console.error('Delete kunstwerk error:', error);
    res.status(500).json({
      success: false,
      message: 'Er is een fout opgetreden bij het verwijderen van het kunstwerk'
    });
  }
};

// Afbeelding toevoegen aan kunstwerk
exports.addAfbeelding = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_hoofdafbeelding } = req.body;
    
    // Controleer of kunstwerk bestaat
    const kunstwerk = await prisma.kunstwerk.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!kunstwerk) {
      return res.status(404).json({
        success: false,
        message: 'Kunstwerk niet gevonden'
      });
    }
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Geen afbeelding geüpload'
      });
    }
    
    // Als dit de hoofdafbeelding wordt, reset andere hoofdafbeeldingen
    if (is_hoofdafbeelding === 'true' || is_hoofdafbeelding === true) {
      await prisma.kunstwerkAfbeelding.updateMany({
        where: { kunstwerk_id: parseInt(id) },
        data: { is_hoofdafbeelding: false }
      });
    }
    
    // Tel huidige afbeeldingen
    const aantalAfbeeldingen = await prisma.kunstwerkAfbeelding.count({
      where: { kunstwerk_id: parseInt(id) }
    });
    
    // Controleer maximum aantal afbeeldingen
    if (aantalAfbeeldingen >= 15) {
      return res.status(400).json({
        success: false,
        message: 'Maximum aantal afbeeldingen (15) bereikt'
      });
    }
    
    // Sla afbeelding op in database
    const nieuweAfbeelding = await prisma.kunstwerkAfbeelding.create({
      data: {
        kunstwerk_id: parseInt(id),
        bestandsnaam: req.file.filename,
        bestandspad: `uploads/kunstwerken/${req.file.filename}`,
        is_hoofdafbeelding: is_hoofdafbeelding === 'true' || is_hoofdafbeelding === true,
        volgorde: aantalAfbeeldingen
      }
    });
    
    res.status(201).json({
      success: true,
      data: nieuweAfbeelding
    });
  } catch (error) {
    console.error('Add afbeelding error:', error);
    res.status(500).json({
      success: false,
      message: 'Er is een fout opgetreden bij het toevoegen van de afbeelding'
    });
  }
};

// Afbeelding verwijderen van kunstwerk
exports.deleteAfbeelding = async (req, res) => {
  try {
    const { id, afbeeldingId } = req.params;
    
    // Haal afbeelding op
    const afbeelding = await prisma.kunstwerkAfbeelding.findFirst({
      where: {
        id: parseInt(afbeeldingId),
        kunstwerk_id: parseInt(id)
      }
    });
    
    if (!afbeelding) {
      return res.status(404).json({
        success: false,
        message: 'Afbeelding niet gevonden'
      });
    }
    
    // Verwijder bestand
    const bestandspad = path.join(__dirname, '../../', afbeelding.bestandspad);
    if (fs.existsSync(bestandspad)) {
      fs.unlinkSync(bestandspad);
    }
    
    // Verwijder record uit database
    await prisma.kunstwerkAfbeelding.delete({
      where: { id: parseInt(afbeeldingId) }
    });
    
    // Als dit de hoofdafbeelding was, maak de eerste overgebleven afbeelding de hoofdafbeelding
    if (afbeelding.is_hoofdafbeelding) {
      const eersteAfbeelding = await prisma.kunstwerkAfbeelding.findFirst({
        where: { kunstwerk_id: parseInt(id) },
        orderBy: { volgorde: 'asc' }
      });
      
      if (eersteAfbeelding) {
        await prisma.kunstwerkAfbeelding.update({
          where: { id: eersteAfbeelding.id },
          data: { is_hoofdafbeelding: true }
        });
      }
    }
    
    res.status(200).json({
      success: true,
      message: `Afbeelding met ID ${afbeeldingId} is verwijderd van kunstwerk ${id}`
    });
  } catch (error) {
    console.error('Delete afbeelding error:', error);
    res.status(500).json({
      success: false,
      message: 'Er is een fout opgetreden bij het verwijderen van de afbeelding'
    });
  }
};

// Bijlage toevoegen aan kunstwerk
exports.addBijlage = async (req, res) => {
  try {
    const { id } = req.params;
    const { beschrijving } = req.body;
    
    // Controleer of kunstwerk bestaat
    const kunstwerk = await prisma.kunstwerk.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!kunstwerk) {
      return res.status(404).json({
        success: false,
        message: 'Kunstwerk niet gevonden'
      });
    }
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Geen bijlage geüpload'
      });
    }
    
    // Bepaal bestandstype
    const ext = path.extname(req.file.originalname).toLowerCase();
    let bestandstype = 'PDF';
    if (ext === '.docx') {
      bestandstype = 'DOCX';
    }
    
    // Sla bijlage op in database
    const nieuweBijlage = await prisma.kunstwerkBijlage.create({
      data: {
        kunstwerk_id: parseInt(id),
        bestandsnaam: req.file.filename,
        bestandspad: `uploads/bijlagen/${req.file.filename}`,
        bestandstype,
        beschrijving
      }
    });
    
    res.status(201).json({
      success: true,
      data: nieuweBijlage
    });
  } catch (error) {
    console.error('Add bijlage error:', error);
    res.status(500).json({
      success: false,
      message: 'Er is een fout opgetreden bij het toevoegen van de bijlage'
    });
  }
};

// Bijlage verwijderen van kunstwerk
exports.deleteBijlage = async (req, res) => {
  try {
    const { id, bijlageId } = req.params;
    
    // Haal bijlage op
    const bijlage = await prisma.kunstwerkBijlage.findFirst({
      where: {
        id: parseInt(bijlageId),
        kunstwerk_id: parseInt(id)
      }
    });
    
    if (!bijlage) {
      return res.status(404).json({
        success: false,
        message: 'Bijlage niet gevonden'
      });
    }
    
    // Verwijder bestand
    const bestandspad = path.join(__dirname, '../../', bijlage.bestandspad);
    if (fs.existsSync(bestandspad)) {
      fs.unlinkSync(bestandspad);
    }
    
    // Verwijder record uit database
    await prisma.kunstwerkBijlage.delete({
      where: { id: parseInt(bijlageId) }
    });
    
    res.status(200).json({
      success: true,
      message: `Bijlage met ID ${bijlageId} is verwijderd van kunstwerk ${id}`
    });
  } catch (error) {
    console.error('Delete bijlage error:', error);
    res.status(500).json({
      success: false,
      message: 'Er is een fout opgetreden bij het verwijderen van de bijlage'
    });
  }
};
