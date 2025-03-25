// Implementatie van de rapportages controller

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const { createReport } = require('docx-templates');
const xml2js = require('xml2js');

// Overzichtsrapportage genereren
exports.getOverzichtsrapportage = async (req, res) => {
  try {
    // Query parameters voor filtering
    const { kunstenaar_id, type_id, locatie_id, min_waarde, max_waarde } = req.query;
    
    // Bouw filter object
    const where = {};
    if (kunstenaar_id) where.kunstenaar_id = parseInt(kunstenaar_id);
    if (type_id) where.type_id = parseInt(type_id);
    if (locatie_id) where.locatie_id = parseInt(locatie_id);
    
    if (min_waarde || max_waarde) {
      where.huidige_marktprijs = {};
      if (min_waarde) where.huidige_marktprijs.gte = parseFloat(min_waarde);
      if (max_waarde) where.huidige_marktprijs.lte = parseFloat(max_waarde);
    }
    
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
        }
      },
      orderBy: {
        titel: 'asc'
      }
    });
    
    // Bereken totalen
    const totaalAantal = kunstwerken.length;
    const totaleWaarde = kunstwerken.reduce((sum, item) => sum + (item.huidige_marktprijs || 0), 0);
    
    // Groepeer per type
    const perType = {};
    kunstwerken.forEach(item => {
      const typeNaam = item.kunstwerkType?.naam || 'Onbekend';
      if (!perType[typeNaam]) {
        perType[typeNaam] = {
          aantal: 0,
          waarde: 0
        };
      }
      perType[typeNaam].aantal += 1;
      perType[typeNaam].waarde += (item.huidige_marktprijs || 0);
    });
    
    // Groepeer per kunstenaar
    const perKunstenaar = {};
    kunstwerken.forEach(item => {
      const kunstenaarNaam = item.kunstenaar?.naam || 'Onbekend';
      if (!perKunstenaar[kunstenaarNaam]) {
        perKunstenaar[kunstenaarNaam] = {
          aantal: 0,
          waarde: 0
        };
      }
      perKunstenaar[kunstenaarNaam].aantal += 1;
      perKunstenaar[kunstenaarNaam].waarde += (item.huidige_marktprijs || 0);
    });
    
    // Groepeer per locatie
    const perLocatie = {};
    kunstwerken.forEach(item => {
      const locatieNaam = item.locatie?.naam || 'Onbekend';
      if (!perLocatie[locatieNaam]) {
        perLocatie[locatieNaam] = {
          aantal: 0,
          waarde: 0
        };
      }
      perLocatie[locatieNaam].aantal += 1;
      perLocatie[locatieNaam].waarde += (item.huidige_marktprijs || 0);
    });
    
    res.status(200).json({
      success: true,
      data: {
        totaal_aantal: totaalAantal,
        totale_waarde: totaleWaarde,
        per_type: perType,
        per_kunstenaar: perKunstenaar,
        per_locatie: perLocatie,
        kunstwerken: kunstwerken.map(item => ({
          id: item.id,
          titel: item.titel,
          kunstenaar: item.kunstenaar?.naam || 'Onbekend',
          type: item.kunstwerkType?.naam || 'Onbekend',
          locatie: item.locatie?.naam || 'Onbekend',
          afmetingen: `${item.hoogte || 0} x ${item.breedte || 0} x ${item.diepte || 0} cm`,
          waarde: item.huidige_marktprijs || 0
        }))
      }
    });
  } catch (error) {
    console.error('Get overzichtsrapportage error:', error);
    res.status(500).json({
      success: false,
      message: 'Er is een fout opgetreden bij het genereren van de overzichtsrapportage'
    });
  }
};

// Waarderingsrapportage genereren
exports.getWaarderingsrapportage = async (req, res) => {
  try {
    // Haal alle kunstwerken op met waarde informatie
    const kunstwerken = await prisma.kunstwerk.findMany({
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
        }
      }
    });
    
    // Bereken totale waarde
    const totaleWaarde = kunstwerken.reduce((sum, item) => sum + (item.huidige_marktprijs || 0), 0);
    const totaleVerzekerdWaarde = kunstwerken.reduce((sum, item) => sum + (item.verzekerde_waarde || 0), 0);
    const totaleAankoopWaarde = kunstwerken.reduce((sum, item) => sum + (item.aankoopprijs || 0), 0);
    
    // Groepeer per kunstenaar
    const waardePerKunstenaar = {};
    kunstwerken.forEach(item => {
      const kunstenaarNaam = item.kunstenaar?.naam || 'Onbekend';
      if (!waardePerKunstenaar[kunstenaarNaam]) {
        waardePerKunstenaar[kunstenaarNaam] = 0;
      }
      waardePerKunstenaar[kunstenaarNaam] += (item.huidige_marktprijs || 0);
    });
    
    // Groepeer per locatie
    const waardePerLocatie = {};
    kunstwerken.forEach(item => {
      const locatieNaam = item.locatie?.naam || 'Onbekend';
      if (!waardePerLocatie[locatieNaam]) {
        waardePerLocatie[locatieNaam] = 0;
      }
      waardePerLocatie[locatieNaam] += (item.huidige_marktprijs || 0);
    });
    
    // Groepeer per type
    const waardePerType = {};
    kunstwerken.forEach(item => {
      const typeNaam = item.kunstwerkType?.naam || 'Onbekend';
      if (!waardePerType[typeNaam]) {
        waardePerType[typeNaam] = 0;
      }
      waardePerType[typeNaam] += (item.huidige_marktprijs || 0);
    });
    
    // Bereken waardestijging
    const waardestijging = totaleWaarde - totaleAankoopWaarde;
    const waardestijgingPercentage = totaleAankoopWaarde > 0 
      ? (waardestijging / totaleAankoopWaarde) * 100 
      : 0;
    
    res.status(200).json({
      success: true,
      data: {
        totale_waarde: totaleWaarde,
        totale_verzekerde_waarde: totaleVerzekerdWaarde,
        totale_aankoop_waarde: totaleAankoopWaarde,
        waardestijging: waardestijging,
        waardestijging_percentage: waardestijgingPercentage,
        waarde_per_kunstenaar: waardePerKunstenaar,
        waarde_per_locatie: waardePerLocatie,
        waarde_per_type: waardePerType,
        kunstwerken: kunstwerken.map(item => ({
          id: item.id,
          titel: item.titel,
          kunstenaar: item.kunstenaar?.naam || 'Onbekend',
          type: item.kunstwerkType?.naam || 'Onbekend',
          locatie: item.locatie?.naam || 'Onbekend',
          aankoopdatum: item.aankoopdatum,
          aankoopprijs: item.aankoopprijs || 0,
          huidige_waarde: item.huidige_marktprijs || 0,
          verzekerde_waarde: item.verzekerde_waarde || 0,
          waardestijging: (item.huidige_marktprijs || 0) - (item.aankoopprijs || 0),
          waardestijging_percentage: item.aankoopprijs > 0 
            ? (((item.huidige_marktprijs || 0) - (item.aankoopprijs || 0)) / item.aankoopprijs) * 100 
            : 0
        }))
      }
    });
  } catch (error) {
    console.error('Get waarderingsrapportage error:', error);
    res.status(500).json({
      success: false,
      message: 'Er is een fout opgetreden bij het genereren van de waarderingsrapportage'
    });
  }
};

// Rapportage per kunstenaar genereren
exports.getKunstenaarRapportage = async (req, res) => {
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
    
    // Haal kunstwerken van deze kunstenaar op
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
        }
      },
      orderBy: {
        titel: 'asc'
      }
    });
    
    // Bereken totalen
    const totaalAantal = kunstwerken.length;
    const totaleWaarde = kunstwerken.reduce((sum, item) => sum + (item.huidige_marktprijs || 0), 0);
    const totaleVerzekerdWaarde = kunstwerken.reduce((sum, item) => sum + (item.verzekerde_waarde || 0), 0);
    
    // Groepeer per type
    const perType = {};
    kunstwerken.forEach(item => {
      const typeNaam = item.kunstwerkType?.naam || 'Onbekend';
      if (!perType[typeNaam]) {
        perType[typeNaam] = {
          aantal: 0,
          waarde: 0
        };
      }
      perType[typeNaam].aantal += 1;
      perType[typeNaam].waarde += (item.huidige_marktprijs || 0);
    });
    
    // Groepeer per locatie
    const perLocatie = {};
    kunstwerken.forEach(item => {
      const locatieNaam = item.locatie?.naam || 'Onbekend';
      if (!perLocatie[locatieNaam]) {
        perLocatie[locatieNaam] = {
          aantal: 0,
          waarde: 0
        };
      }
      perLocatie[locatieNaam].aantal += 1;
      perLocatie[locatieNaam].waarde += (item.huidige_marktprijs || 0);
    });
    
    res.status(200).json({
      success: true,
      data: {
        kunstenaar: {
          id: kunstenaar.id,
          naam: kunstenaar.naam,
          geboortedatum: kunstenaar.geboortedatum,
          overlijdensdatum: kunstenaar.overlijdensdatum,
          land: kunstenaar.land,
          biografie: kunstenaar.biografie
        },
        totaal_aantal: totaalAantal,
        totale_waarde: totaleWaarde,
        totale_verzekerde_waarde: totaleVerzekerdWaarde,
        per_type: perType,
        per_locatie: perLocatie,
        kunstwerken: kunstwerken.map(item => ({
          id: item.id,
          titel: item.titel,
          type: item.kunstwerkType?.naam || 'Onbekend',
          locatie: item.locatie?.naam || 'Onbekend',
          afmetingen: `${item.hoogte || 0} x ${item.breedte || 0} x ${item.diepte || 0} cm`,
          productiedatum: item.productiedatum,
          aankoopdatum: item.aankoopdatum,
          aankoopprijs: item.aankoopprijs || 0,
          huidige_waarde: item.huidige_marktprijs || 0,
          verzekerde_waarde: item.verzekerde_waarde || 0
        }))
      }
    });
  } catch (error) {
    console.error('Get kunstenaar rapportage error:', error);
    res.status(500).json({
      success: false,
      message: 'Er is een fout opgetreden bij het genereren van de kunstenaar rapportage'
    });
  }
};

// Rapportage per locatie genereren
exports.getLocatieRapportage = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Controleer of locatie bestaat
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
    
    // Haal kunstwerken op deze locatie op
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
        }
      },
      orderBy: {
        titel: 'asc'
      }
    });
    
    // Bereken totalen
    const totaalAantal = kunstwerken.length;
    const totaleWaarde = kunstwerken.reduce((sum, item) => sum + (item.huidige_marktprijs || 0), 0);
    const totaleVerzekerdWaarde = kunstwerken.reduce((sum, item) => sum + (item.verzekerde_waarde || 0), 0);
    
    // Groepeer per type
    const perType = {};
    kunstwerken.forEach(item => {
      const typeNaam = item.kunstwerkType?.naam || 'Onbekend';
      if (!perType[typeNaam]) {
        perType[typeNaam] = {
          aantal: 0,
          waarde: 0
        };
      }
      perType[typeNaam].aantal += 1;
      perType[typeNaam].waarde += (item.huidige_marktprijs || 0);
    });
    
    // Groepeer per kunstenaar
    const perKunstenaar = {};
    kunstwerken.forEach(item => {
      const kunstenaarNaam = item.kunstenaar?.naam || 'Onbekend';
      if (!perKunstenaar[kunstenaarNaam]) {
        perKunstenaar[kunstenaarNaam] = {
          aantal: 0,
          waarde: 0
        };
      }
      perKunstenaar[kunstenaarNaam].aantal += 1;
      perKunstenaar[kunstenaarNaam].waarde += (item.huidige_marktprijs || 0);
    });
    
    res.status(200).json({
      success: true,
      data: {
        locatie: {
          id: locatie.id,
          naam: locatie.naam,
          adres: locatie.adres,
          postcode: locatie.postcode,
          plaats: locatie.plaats,
          land: locatie.land,
          type: locatie.locatieType?.naam || 'Onbekend'
        },
        totaal_aantal: totaalAantal,
        totale_waarde: totaleWaarde,
        totale_verzekerde_waarde: totaleVerzekerdWaarde,
        per_type: perType,
        per_kunstenaar: perKunstenaar,
        kunstwerken: kunstwerken.map(item => ({
          id: item.id,
          titel: item.titel,
          kunstenaar: item.kunstenaar?.naam || 'Onbekend',
          type: item.kunstwerkType?.naam || 'Onbekend',
          afmetingen: `${item.hoogte || 0} x ${item.breedte || 0} x ${item.diepte || 0} cm`,
          huidige_waarde: item.huidige_marktprijs || 0,
          verzekerde_waarde: item.verzekerde_waarde || 0
        }))
      }
    });
  } catch (error) {
    console.error('Get locatie rapportage error:', error);
    res.status(500).json({
      success: false,
      message: 'Er is een fout opgetreden bij het genereren van de locatie rapportage'
    });
  }
};

// Rapportage exporteren
exports.exportRapportage = async (req, res) => {
  try {
    const { type, format, filters, fields } = req.body;
    
    // Valideer verplichte velden
    if (!type || !format) {
      return res.status(400).json({
        success: false,
        message: 'Type rapportage en formaat zijn verplicht'
      });
    }
    
    // Controleer of formaat ondersteund wordt
    const supportedFormats = ['pdf', 'docx', 'xlsx', 'xml'];
    if (!supportedFormats.includes(format)) {
      return res.status(400).json({
        success: false,
        message: `Formaat ${format} wordt niet ondersteund. Gebruik een van: ${supportedFormats.join(', ')}`
      });
    }
    
    // Haal rapportage data op
    let rapportageData;
    switch (type) {
      case 'overzicht':
        const overzichtResponse = await this.getOverzichtsrapportage({ query: filters }, { json: () => {} });
        rapportageData = overzichtResponse.data;
        break;
      case 'waardering':
        const waarderingResponse = await this.getWaarderingsrapportage({ query: filters }, { json: () => {} });
        rapportageData = waarderingResponse.data;
        break;
      case 'kunstenaar':
        if (!filters.kunstenaar_id) {
          return res.status(400).json({
            success: false,
            message: 'Kunstenaar ID is verplicht voor kunstenaar rapportage'
          });
        }
        const kunstenaarResponse = await this.getKunstenaarRapportage(
          { params: { id: filters.kunstenaar_id } }, 
          { json: () => {} }
        );
        rapportageData = kunstenaarResponse.data;
        break;
      case 'locatie':
        if (!filters.locatie_id) {
          return res.status(400).json({
            success: false,
            message: 'Locatie ID is verplicht voor locatie rapportage'
          });
        }
        const locatieResponse = await this.getLocatieRapportage(
          { params: { id: filters.locatie_id } }, 
          { json: () => {} }
        );
        rapportageData = locatieResponse.data;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: `Onbekend rapportage type: ${type}`
        });
    }
    
    // Genereer bestandsnaam
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `rapportage_${type}_${timestamp}.${format}`;
    const filePath = path.join(__dirname, '../../uploads/rapportages', fileName);
    
    // Zorg ervoor dat de directory bestaat
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Genereer bestand op basis van formaat
    switch (format) {
      case 'pdf':
        // Placeholder voor PDF generatie
        // In een echte implementatie zou hier PDFKit of een andere PDF library gebruikt worden
        const doc = new PDFDocument();
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);
        doc.fontSize(25).text(`${type.charAt(0).toUpperCase() + type.slice(1)} Rapportage`, {
          align: 'center'
        });
        doc.end();
        break;
        
      case 'docx':
        // Placeholder voor DOCX generatie
        // In een echte implementatie zou hier docx-templates of een andere DOCX library gebruikt worden
        break;
        
      case 'xlsx':
        // Placeholder voor XLSX generatie
        // In een echte implementatie zou hier ExcelJS of een andere Excel library gebruikt worden
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(`${type} Rapportage`);
        
        // Voeg headers toe
        const headers = fields || ['titel', 'kunstenaar', 'type', 'locatie', 'waarde'];
        worksheet.addRow(headers);
        
        // Voeg data toe
        if (rapportageData.kunstwerken) {
          rapportageData.kunstwerken.forEach(item => {
            const row = [];
            headers.forEach(header => {
              row.push(item[header] || '');
            });
            worksheet.addRow(row);
          });
        }
        
        await workbook.xlsx.writeFile(filePath);
        break;
        
      case 'xml':
        // Placeholder voor XML generatie
        // In een echte implementatie zou hier xml2js of een andere XML library gebruikt worden
        const builder = new xml2js.Builder();
        const xml = builder.buildObject({
          rapportage: {
            type: type,
            datum: new Date().toISOString(),
            data: rapportageData
          }
        });
        fs.writeFileSync(filePath, xml);
        break;
    }
    
    // Stuur download URL terug
    const downloadUrl = `/api/downloads/rapportages/${fileName}`;
    
    res.status(200).json({
      success: true,
      message: `Rapportage is succesvol geëxporteerd naar ${format.toUpperCase()} formaat`,
      download_url: downloadUrl
    });
  } catch (error) {
    console.error('Export rapportage error:', error);
    res.status(500).json({
      success: false,
      message: 'Er is een fout opgetreden bij het exporteren van de rapportage'
    });
  }
};
