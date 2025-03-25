// Implementatie van de kunstenaars controller

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

// Alle kunstenaars ophalen
exports.getAllKunstenaars = async (req, res) => {
  try {
    // Query parameters voor filtering en paginering
    const { naam, land, page = 1, limit = 10 } = req.query;
    
    // Bouw filter object
    const where = {};
    if (naam) where.naam = { contains: naam };
    if (land) where.land = { contains: land };
    
    // Bereken skip voor paginering
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Haal kunstenaars op
    const kunstenaars = await prisma.kunstenaar.findMany({
      where,
      skip,
      take: parseInt(limit),
      orderBy: {
        naam: 'asc'
      }
    });
    
    // Tel totaal aantal kunstenaars voor paginering
    const total = await prisma.kunstenaar.count({ where });
    
    // Haal aantal kunstwerken per kunstenaar op
    const kunstenaarsMetAantal = await Promise.all(
      kunstenaars.map(async (kunstenaar) => {
        const aantalKunstwerken = await prisma.kunstwerk.count({
          where: { kunstenaar_id: kunstenaar.id }
        });
        
        return {
          ...kunstenaar,
          aantal_kunstwerken: aantalKunstwerken
        };
      })
    );
    
    res.status(200).json({
      success: true,
      data: kunstenaarsMetAantal,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get all kunstenaars error:', error);
    res.status(500).json({
      success: false,
      message: 'Er is een fout opgetreden bij het ophalen van de kunstenaars'
    });
  }
};

// Specifieke kunstenaar ophalen
exports.getKunstenaarById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const kunstenaar = await prisma.kunstenaar.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!kunstenaar) {
      return res.status(404).json({
        success: false,
        message: 'Kunstenaar niet gevonden'
      });
    }
    
    // Tel aantal kunstwerken
    const aantalKunstwerken = await prisma.kunstwerk.count({
      where: { kunstenaar_id: parseInt(id) }
    });
    
    res.status(200).json({
      success: true,
      data: {
        ...kunstenaar,
        aantal_kunstwerken: aantalKunstwerken
      }
    });
  } catch (error) {
    console.error('Get kunstenaar by id error:', error);
    res.status(500).json({
      success: false,
      message: 'Er is een fout opgetreden bij het ophalen van de kunstenaar'
    });
  }
};

// Nieuwe kunstenaar toevoegen
exports.createKunstenaar = async (req, res) => {
  try {
    const {
      naam,
      adres,
      postcode,
      plaats,
      land,
      telefoon,
      email,
      website,
      geboortedatum,
      overlijdensdatum,
      biografie
    } = req.body;
    
    // Valideer verplichte velden
    if (!naam) {
      return res.status(400).json({
        success: false,
        message: 'Naam is verplicht'
      });
    }
    
    // Maak nieuwe kunstenaar aan
    const nieuweKunstenaar = await prisma.kunstenaar.create({
      data: {
        naam,
        adres,
        postcode,
        plaats,
        land,
        telefoon,
        email,
        website,
        geboortedatum: geboortedatum ? new Date(geboortedatum) : null,
        overlijdensdatum: overlijdensdatum ? new Date(overlijdensdatum) : null,
        biografie
      }
    });
    
    res.status(201).json({
      success: true,
      data: nieuweKunstenaar
    });
  } catch (error) {
    console.error('Create kunstenaar error:', error);
    res.status(500).json({
      success: false,
      message: 'Er is een fout opgetreden bij het aanmaken van de kunstenaar'
    });
  }
};

// Kunstenaar bijwerken
exports.updateKunstenaar = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      naam,
      adres,
      postcode,
      plaats,
      land,
      telefoon,
      email,
      website,
      geboortedatum,
      overlijdensdatum,
      biografie
    } = req.body;
    
    // Controleer of kunstenaar bestaat
    const bestaandeKunstenaar = await prisma.kunstenaar.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!bestaandeKunstenaar) {
      return res.status(404).json({
        success: false,
        message: 'Kunstenaar niet gevonden'
      });
    }
    
    // Update kunstenaar
    const updatedKunstenaar = await prisma.kunstenaar.update({
      where: { id: parseInt(id) },
      data: {
        naam,
        adres,
        postcode,
        plaats,
        land,
        telefoon,
        email,
        website,
        geboortedatum: geboortedatum ? new Date(geboortedatum) : null,
        overlijdensdatum: overlijdensdatum ? new Date(overlijdensdatum) : null,
        biografie
      }
    });
    
    res.status(200).json({
      success: true,
      data: updatedKunstenaar
    });
  } catch (error) {
    console.error('Update kunstenaar error:', error);
    res.status(500).json({
      success: false,
      message: 'Er is een fout opgetreden bij het bijwerken van de kunstenaar'
    });
  }
};

// Kunstenaar verwijderen
exports.deleteKunstenaar = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Controleer of kunstenaar bestaat
    const kunstenaar = await prisma.kunstenaar.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!kunstenaar) {
      return res.status(404).json({
        success: false,
        message: 'Kunstenaar niet gevonden'
      });
    }
    
    // Controleer of er kunstwerken aan deze kunstenaar zijn gekoppeld
    const aantalKunstwerken = await prisma.kunstwerk.count({
      where: { kunstenaar_id: parseInt(id) }
    });
    
    if (aantalKunstwerken > 0) {
      return res.status(400).json({
        success: false,
        message: `Kan kunstenaar niet verwijderen omdat er ${aantalKunstwerken} kunstwerken aan gekoppeld zijn`
      });
    }
    
    // Verwijder portretfoto indien aanwezig
    if (kunstenaar.portretfoto_url) {
      const bestandspad = path.join(__dirname, '../../', kunstenaar.portretfoto_url);
      if (fs.existsSync(bestandspad)) {
        fs.unlinkSync(bestandspad);
      }
    }
    
    // Verwijder kunstenaar
    await prisma.kunstenaar.delete({
      where: { id: parseInt(id) }
    });
    
    res.status(200).json({
      success: true,
      message: `Kunstenaar met ID ${id} is verwijderd`
    });
  } catch (error) {
    console.error('Delete kunstenaar error:', error);
    res.status(500).json({
      success: false,
      message: 'Er is een fout opgetreden bij het verwijderen van de kunstenaar'
    });
  }
};

// Kunstwerken van een specifieke kunstenaar ophalen
exports.getKunstenaarKunstwerken = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    // Controleer of kunstenaar bestaat
    const kunstenaar = await prisma.kunstenaar.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!kunstenaar) {
      return res.status(404).json({
        success: false,
        message: 'Kunstenaar niet gevonden'
      });
    }
    
    // Bereken skip voor paginering
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Haal kunstwerken op
    const kunstwerken = await prisma.kunstwerk.findMany({
      where: { kunstenaar_id: parseInt(id) },
      include: {
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
    const total = await prisma.kunstwerk.count({
      where: { kunstenaar_id: parseInt(id) }
    });
    
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
    console.error('Get kunstenaar kunstwerken error:', error);
    res.status(500).json({
      success: false,
      message: 'Er is een fout opgetreden bij het ophalen van de kunstwerken'
    });
  }
};
