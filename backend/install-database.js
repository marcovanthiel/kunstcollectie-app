// Database installatie script voor Kunstcollectie App
// Dit script initialiseert de database, voert migraties uit en seed de initiële data
// Gebruik: node install-database.js

require('dotenv').config();
const { execSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

// Controleer of DATABASE_URL is ingesteld
if (!process.env.DATABASE_URL) {
  console.error('Fout: DATABASE_URL omgevingsvariabele is niet ingesteld');
  console.error('Maak een .env bestand aan met DATABASE_URL=postgresql://gebruiker:wachtwoord@host:port/database');
  process.exit(1);
}

async function installDatabase() {
  try {
    console.log('Start database installatie proces...');
    
    // Stap 1: Controleer database verbinding
    console.log('Controleren van database verbinding...');
    await testDatabaseConnection();
    
    // Stap 2: Voer Prisma migraties uit
    console.log('Uitvoeren van database migraties...');
    await runMigrations();
    
    // Stap 3: Seed de database met initiële data
    console.log('Seeden van database met initiële data...');
    await seedDatabase();
    
    console.log('Database installatie succesvol voltooid!');
    console.log('Je kunt nu inloggen met:');
    console.log('Email: marco@marcovanthiel.nl');
    console.log('Wachtwoord: Wikkie=5');
    
    return true;
  } catch (error) {
    console.error('Fout bij database installatie:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

// Functie om database verbinding te testen
async function testDatabaseConnection() {
  try {
    // Probeer een eenvoudige query uit te voeren
    await prisma.$queryRaw`SELECT 1`;
    console.log('Database verbinding succesvol');
    return true;
  } catch (error) {
    console.error('Database verbinding mislukt:', error);
    throw new Error('Kan geen verbinding maken met de database. Controleer je DATABASE_URL.');
  }
}

// Functie om Prisma migraties uit te voeren
async function runMigrations() {
  try {
    // Gebruik Prisma CLI om migraties uit te voeren
    console.log('Genereren van Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    console.log('Uitvoeren van Prisma migraties...');
    // In productie gebruiken we db push om het schema direct toe te passen zonder migratie geschiedenis
    execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
    
    return true;
  } catch (error) {
    console.error('Fout bij uitvoeren van migraties:', error);
    throw error;
  }
}

// Functie om database te seeden met initiële data
async function seedDatabase() {
  try {
    console.log('Start seeding database...');
    
    // Maak locatie types aan
    const locatieTypes = [
      { naam: 'Kantoor', beschrijving: 'Kantoorruimte' },
      { naam: 'Galerie', beschrijving: 'Kunstgalerie' },
      { naam: 'Opslag', beschrijving: 'Opslagruimte' },
      { naam: 'Museum', beschrijving: 'Museum' },
      { naam: 'Privéwoning', beschrijving: 'Privéwoning' }
    ];
    
    for (const type of locatieTypes) {
      await prisma.locatieType.upsert({
        where: { naam: type.naam },
        update: {},
        create: type
      });
    }
    
    console.log('Locatie types aangemaakt');
    
    // Maak kunstwerk types aan
    const kunstwerkTypes = [
      { naam: 'Schilderij', beschrijving: 'Schilderij op doek of paneel' },
      { naam: 'Sculptuur', beschrijving: 'Driedimensionaal kunstwerk' },
      { naam: 'Fotografie', beschrijving: 'Fotografisch werk' },
      { naam: 'Tekening', beschrijving: 'Tekening op papier' },
      { naam: 'Grafiek', beschrijving: 'Grafisch werk' },
      { naam: 'Installatie', beschrijving: 'Kunstinstallatie' },
      { naam: 'Mixed Media', beschrijving: 'Werk met gemengde technieken' }
    ];
    
    for (const type of kunstwerkTypes) {
      await prisma.kunstwerkType.upsert({
        where: { naam: type.naam },
        update: {},
        create: type
      });
    }
    
    console.log('Kunstwerk types aangemaakt');
    
    // Maak leveranciers aan
    const leveranciers = [
      { 
        naam: 'Galerie Amsterdam', 
        adres: 'Galeriestraat 123', 
        postcode: '1012 AB', 
        plaats: 'Amsterdam', 
        land: 'Nederland',
        telefoon: '020-1234567',
        email: 'info@galerieamsterdam.nl',
        website: 'www.galerieamsterdam.nl'
      },
      { 
        naam: 'Kunsthandel Rotterdam', 
        adres: 'Kunstlaan 45', 
        postcode: '3012 BC', 
        plaats: 'Rotterdam', 
        land: 'Nederland',
        telefoon: '010-7654321',
        email: 'info@kunsthandelrotterdam.nl',
        website: 'www.kunsthandelrotterdam.nl'
      },
      { 
        naam: 'Veilinghuis Utrecht', 
        adres: 'Veilingweg 78', 
        postcode: '3511 DE', 
        plaats: 'Utrecht', 
        land: 'Nederland',
        telefoon: '030-9876543',
        email: 'info@veilinghuisutrecht.nl',
        website: 'www.veilinghuisutrecht.nl'
      }
    ];
    
    for (const leverancier of leveranciers) {
      await prisma.leverancier.upsert({
        where: { naam: leverancier.naam },
        update: {},
        create: leverancier
      });
    }
    
    console.log('Leveranciers aangemaakt');
    
    // Maak admin gebruiker aan als deze nog niet bestaat
    const adminExists = await prisma.gebruiker.findUnique({
      where: { email: 'marco@marcovanthiel.nl' }
    });
    
    if (!adminExists) {
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash('Wikkie=5', 10);
      
      await prisma.gebruiker.create({
        data: {
          email: 'marco@marcovanthiel.nl',
          wachtwoord: hashedPassword,
          naam: 'Admin Gebruiker',
          rol: 'admin'
        }
      });
      
      console.log('Admin gebruiker aangemaakt');
    } else {
      console.log('Admin gebruiker bestaat al');
    }
    
    console.log('Database seeding voltooid');
    return true;
  } catch (error) {
    console.error('Fout bij seeden van database:', error);
    throw error;
  }
}

// Voer het installatie proces uit
installDatabase()
  .then((success) => {
    if (success) {
      console.log('Database installatie succesvol afgerond');
      process.exit(0);
    } else {
      console.error('Database installatie mislukt');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('Onverwachte fout bij database installatie:', error);
    process.exit(1);
  });
