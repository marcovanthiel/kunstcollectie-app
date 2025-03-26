// Cloudflare deployment script voor Kunstcollectie App
// Dit script automatiseert de deployment van de applicatie naar Cloudflare Pages
// en initialiseert de database

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuratie met relatieve paden
const config = {
  projectName: 'kunstcollectie-app',
  frontendDir: path.join(__dirname, 'frontend'),
  backendDir: path.join(__dirname, 'backend'),
  apiDomain: 'api.projectkunst.nl'
};

console.log('Configuratie:');
console.log(`- Project directory: ${__dirname}`);
console.log(`- Frontend directory: ${config.frontendDir}`);
console.log(`- Backend directory: ${config.backendDir}`);

// Controleer of de directories bestaan
if (!fs.existsSync(config.frontendDir)) {
  console.error(`Frontend directory bestaat niet: ${config.frontendDir}`);
  console.error('Zorg ervoor dat je het script uitvoert vanuit de hoofdmap van de repository.');
  process.exit(1);
}

if (!fs.existsSync(config.backendDir)) {
  console.error(`Backend directory bestaat niet: ${config.backendDir}`);
  console.error('Zorg ervoor dat je het script uitvoert vanuit de hoofdmap van de repository.');
  process.exit(1);
}

async function deployToCloudflare() {
  try {
    console.log('Start Cloudflare deployment proces...');
    
    // Stap 1: Controleer of Wrangler is geïnstalleerd
    console.log('Controleren van Wrangler installatie...');
    try {
      execSync('npx wrangler --version', { stdio: 'inherit' });
    } catch (error) {
      console.log('Wrangler niet gevonden, installeren...');
      execSync('npm install -g wrangler', { stdio: 'inherit' });
    }
    
    // Stap 2: Configureer de database in Cloudflare D1
    console.log('Configureren van database in Cloudflare D1...');
    setupCloudflareD1();
    
    // Stap 3: Deploy de backend API
    console.log('Deployen van backend API...');
    deployBackend();
    
    // Stap 4: Deploy de frontend applicatie
    console.log('Deployen van frontend applicatie...');
    deployFrontend();
    
    // Stap 5: Initialiseer de database
    console.log('Initialiseren van database...');
    initializeDatabase();
    
    console.log('Deployment succesvol voltooid!');
    console.log(`Frontend beschikbaar op: https://${config.projectName}.pages.dev`);
    console.log(`Backend API beschikbaar op: https://${config.apiDomain}`);
    console.log('Je kunt nu inloggen met:');
    console.log('Email: marco@marcovanthiel.nl');
    console.log('Wachtwoord: Wikkie=5');
    
    return true;
  } catch (error) {
    console.error('Fout bij Cloudflare deployment:', error);
    return false;
  }
}

// Functie om Cloudflare D1 database op te zetten
function setupCloudflareD1() {
  try {
    // Controleer of de database al bestaat
    const output = execSync('npx wrangler d1 list', { encoding: 'utf8' });
    
    if (!output.includes('kunstcollectie_db')) {
      console.log('Aanmaken van nieuwe D1 database: kunstcollectie_db');
      execSync('npx wrangler d1 create kunstcollectie_db', { stdio: 'inherit' });
      
      // Haal database ID op voor wrangler.toml configuratie
      const dbListOutput = execSync('npx wrangler d1 list --json', { encoding: 'utf8' });
      const databases = JSON.parse(dbListOutput);
      const dbInfo = databases.find(db => db.name === 'kunstcollectie_db');
      
      if (dbInfo && dbInfo.uuid) {
        console.log(`Database aangemaakt met ID: ${dbInfo.uuid}`);
        // Update wrangler.toml met database ID
        updateWranglerConfig(dbInfo.uuid);
      }
    } else {
      console.log('D1 database bestaat al');
    }
  } catch (error) {
    console.error('Fout bij setup van Cloudflare D1:', error);
    throw error;
  }
}

// Functie om wrangler.toml bij te werken met database ID
function updateWranglerConfig(databaseId) {
  const wranglerPath = path.join(config.frontendDir, 'wrangler.toml');
  
  console.log(`Bijwerken van wrangler.toml op pad: ${wranglerPath}`);
  
  // Controleer of het bestand bestaat
  if (!fs.existsSync(wranglerPath)) {
    throw new Error(`wrangler.toml bestand niet gevonden op pad: ${wranglerPath}`);
  }
  
  let wranglerConfig = fs.readFileSync(wranglerPath, 'utf8');
  
  // Update database_id in wrangler.toml
  wranglerConfig = wranglerConfig.replace(/database_id = ".*"/, `database_id = "${databaseId}"`);
  
  fs.writeFileSync(wranglerPath, wranglerConfig);
  console.log('wrangler.toml bijgewerkt met database ID');
}

// Functie om backend API te deployen
function deployBackend() {
  try {
    console.log(`Navigeren naar backend directory: ${config.backendDir}`);
    process.chdir(config.backendDir);
    
    // Controleer of wrangler.toml bestaat in de backend directory
    const backendWranglerPath = path.join(config.backendDir, 'wrangler.toml');
    if (!fs.existsSync(backendWranglerPath)) {
      console.log('wrangler.toml niet gevonden in backend directory, aanmaken...');
      const wranglerContent = `name = "kunstcollectie-app-api"
compatibility_date = "2023-01-01"
main = "src/index.js"

[vars]
DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/kunstcollectie"
JWT_SECRET = "kunstcollectie_secret_key"
JWT_EXPIRES_IN = "24h"`;
      fs.writeFileSync(backendWranglerPath, wranglerContent);
      console.log('wrangler.toml aangemaakt voor backend');
    }
    
    // Installeer dependencies
    console.log('Installeren van backend dependencies...');
    execSync('npm install', { stdio: 'inherit' });
    
    // Genereer Prisma client
    console.log('Genereren van Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    // Deploy als Cloudflare Worker
    console.log('Deployen van backend als Cloudflare Worker...');
    execSync('npx wrangler deploy', { stdio: 'inherit' });
    
    console.log('Backend API succesvol gedeployed');
  } catch (error) {
    console.error('Fout bij deployen van backend:', error);
    throw error;
  }
}

// Functie om frontend applicatie te deployen
function deployFrontend() {
  try {
    console.log(`Navigeren naar frontend directory: ${config.frontendDir}`);
    process.chdir(config.frontendDir);
    
    // Installeer dependencies
    console.log('Installeren van frontend dependencies...');
    execSync('npm install', { stdio: 'inherit' });
    
    // Bouw de applicatie
    console.log('Bouwen van frontend applicatie...');
    execSync('npm run build', { stdio: 'inherit' });
    
    // Deploy naar Cloudflare Pages
    console.log('Deployen naar Cloudflare Pages...');
    execSync(`npx wrangler pages deploy dist --project-name=${config.projectName}`, { stdio: 'inherit' });
    
    console.log('Frontend applicatie succesvol gedeployed');
  } catch (error) {
    console.error('Fout bij deployen van frontend:', error);
    throw error;
  }
}

// Functie om database te initialiseren
function initializeDatabase() {
  try {
    console.log(`Navigeren naar backend directory: ${config.backendDir}`);
    process.chdir(config.backendDir);
    
    // Voer het database installatie script uit
    console.log('Uitvoeren van database installatie script...');
    execSync('node install-database.js', { stdio: 'inherit' });
    
    console.log('Database succesvol geïnitialiseerd');
  } catch (error) {
    console.error('Fout bij initialiseren van database:', error);
    throw error;
  }
}

// Voer de deployment uit
deployToCloudflare()
  .then((success) => {
    if (success) {
      console.log('Cloudflare deployment succesvol afgerond');
      process.exit(0);
    } else {
      console.error('Cloudflare deployment mislukt');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('Onverwachte fout bij Cloudflare deployment:', error);
    process.exit(1);
  });
