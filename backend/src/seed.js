// Database seeder script

const { seedDatabase } = require('../models');

// Voer de seed functie uit
seedDatabase()
  .then(() => {
    console.log('Database succesvol geseeded');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fout bij seeden van database:', error);
    process.exit(1);
  });
