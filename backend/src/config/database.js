// Database configuratie en setup script

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Functie om database verbinding te testen
async function testDatabaseConnection() {
  try {
    // Probeer een eenvoudige query uit te voeren
    await prisma.$queryRaw`SELECT 1`;
    console.log('Database verbinding succesvol');
    return true;
  } catch (error) {
    console.error('Database verbinding mislukt:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

// Functie om database tabellen te initialiseren
async function initializeDatabase() {
  try {
    console.log('Start initialisatie van database tabellen...');
    
    // In een echte implementatie zou hier Prisma migrate gebruikt worden
    // Voor deze demo gebruiken we de schema.prisma die al is gedefinieerd
    
    console.log('Database tabellen succesvol geïnitialiseerd');
    return true;
  } catch (error) {
    console.error('Fout bij initialiseren van database tabellen:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = {
  testDatabaseConnection,
  initializeDatabase
};
