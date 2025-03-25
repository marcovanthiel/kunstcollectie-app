// Implementatie van de locaties controller

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Alle locaties ophalen
exports.getAllLocaties = async (req, res) => {
  try {
    // Query parameters voor filtering en paginering
    const { naam, type_id, page = 1, limit = 10 } = req.query;
    
    // Bouw filter object
    const where = {};
    if (naam) where.naam = { contains: naam };
    if (type_id) where.type_id = parseInt(type_id);
    
    // Bereken skip voor paginering
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Haal locaties op met relaties
    const locaties = await prisma.locatie.findMany({
      where,
      include: {
        locatieType: {
          select: {
            id: true,
            naam: true
          }
        }
      },
      skip,
      take: parseInt(limit),
      orderBy: {
        naam: 'asc'
      }
    });
    
    // Tel totaal aantal locaties voor paginering
    const total = await prisma.locatie.count({ where });
    
    // Haal aantal kunstwerken per locatie op
    const locatiesMetAantal = await Promise.all(
      locaties.map(async (locatie) => {
        const aantalKunstwerken = await prisma.kunstwerk.count({
          where: { locatie_id: locatie.id }
        });
        
        return {
          ...locatie,
          aantal_kunstwerken: aantalKunstwerken
        };
      })
    );
    
    res.status(200).json({
      success: true,
      data: locatiesMetAantal,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get all locaties error:', error);
    res.status(500).json({
      success: false,
      message: 'Er is een fout opgetreden bij het ophalen van de locaties'
    });
  }
};

// Specifieke locatie ophalen
exports.getLocatieById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const locatie = await prisma.locatie.findUnique({
      where: { id: parseInt(id) },
      include: {
        locatieType: true
      }
    });
    
    if (!locatie) {
      return res.status(404).json({
        success: false,
        message: 'Locatie niet gevonden'
      });
    }
    
    // Tel aantal kunstwerken
    const aantalKunstwerken = await prisma.kunstwerk.count({
      where: { locatie_id: parseInt(id) }
    });
    
    res.status(200).json({
      success: true,
      data: {
        ...locatie,
        aantal_kunstwerken: aantalKunstwerken
      }
    });
  } catch (error) {
    console.error('Get locatie by id error:', error);
    res.status(500).json({
      success: false,
      message: 'Er is een fout opgetreden bij het ophalen van de locatie'
    });
  }
};

// Nieuwe locatie toevoegen
exports.createLocatie = async (req, res) => {
  try {
    const {
      naam,
      adres,
      postcode,
      plaats,
      land,
      type_id,
      latitude,
      longitude
    } = req.body;
    
    // Valideer verplichte velden
    if (!naam || !adres || !postcode || !plaats || !land || !type_id) {
      return res.status(400).json({
        success: false,
        message: 'Naam, adres, postcode, plaats, land en type zijn verplicht'
      });
    }
    
    // Maak nieuwe locatie aan
    const nieuweLocatie = await prisma.locatie.create({
      data: {
        naam,
        adres,
        postcode,
        plaats,
        land,
        type_id: parseInt(type_id),
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null
      }
    });
    
    res.status(201).json({
      success: true,
      data: nieuweLocatie
    });
  } catch (error) {
    console.error('Create locatie error:', error);
    res.status(500).json({
      success: false,
      message: 'Er is een fout opgetreden bij het aanmaken van de locatie'
    });
  }
};

// Locatie bijwerken
exports.updateLocatie = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      naam,
      adres,
      postcode,
      plaats,
      land,
      type_id,
      latitude,
      longitude
    } = req.body;
    
    // Controleer of locatie bestaat
    const bestaandeLocatie = await prisma.locatie.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!bestaandeLocatie) {
      return res.status(404).json({
        success: false,
        message: 'Locatie niet gevonden'
      });
    }
    
    // Update locatie
    const updatedLocatie = await prisma.locatie.update({
      where: { id: parseInt(id) },
      data: {
        naam,
        adres,
        postcode,
        plaats,
        land,
        type_id: type_id ? parseInt(type_id) : undefined,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null
      }
    });
    
    res.status(200).json({
      success: true,
      data: updatedLocatie
    });
  } catch (error) {
    console.error('Update locatie error:', error);
    res.status(500).json({
      success: false,
      message: 'Er is een fout opgetreden bij het bijwerken van de locatie'
    });
  }
};

// Locatie verwijderen
exports.deleteLocatie = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Controleer of locatie bestaat
    const locatie = await prisma.locatie.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!locatie) {
      return res.status(404).json({
        success: false,
        message: 'Locatie niet gevonden'
      });
    }
    
    // Controleer of er kunstwerken aan deze locatie zijn gekoppeld
    const aantalKunstwerken = await prisma.kunstwerk.count({
      where: { locatie_id: parseInt(id) }
    });
    
    if (aantalKunstwerken > 0) {
      return res.status(400).json({
        success: false,
        message: `Kan locatie niet verwijderen omdat er ${aantalKunstwerken} kunstwerken aan gekoppeld zijn`
      });
    }
    
    // Verwijder locatie
    await prisma.locatie.delete({
      where: { id: parseInt(id) }
    });
    
    res.status(200).json({
      success: true,
      message: `Locatie met ID ${id} is verwijderd`
    });
  } catch (error) {
    console.error('Delete locatie error:', error);
    res.status(500).json({
      success: false,
      message: 'Er is een fout opgetreden bij het verwijderen van de locatie'
    });
  }
};

// Kunstwerken op een specifieke locatie ophalen
exports.getLocatieKunstwerken = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    // Controleer of locatie bestaat
    const locatie = await prisma.locatie.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!locatie) {
      return res.status(404).json({
        success: false,
        message: 'Locatie niet gevonden'
      });
    }
    
    // Bereken skip voor paginering
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Haal kunstwerken op
    const kunstwerken = await prisma.kunstwerk.findMany({
      where: { locatie_id: parseInt(id) },
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
      where: { locatie_id: parseInt(id) }
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
    console.error('Get locatie kunstwerken error:', error);
    res.status(500).json({
      success: false,
      message: 'Er is een fout opgetreden bij het ophalen van de kunstwerken'
    });
  }
};
