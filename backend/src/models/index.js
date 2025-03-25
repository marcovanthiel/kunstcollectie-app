// Database model implementatie
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Seed data voor initiële database setup
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
      where: { email: 'admin@kunstcollectie.nl' }
    });
    
    if (!adminExists) {
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await prisma.gebruiker.create({
        data: {
          email: 'admin@kunstcollectie.nl',
          wachtwoord: hashedPassword,
          naam: 'Admin Gebruiker',
          rol: 'admin'
        }
      });
      
      console.log('Admin gebruiker aangemaakt');
    }
    
    console.log('Database seeding voltooid');
  } catch (error) {
    console.error('Fout bij seeden van database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = {
  prisma,
  seedDatabase
};
