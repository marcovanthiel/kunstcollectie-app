# Finale Deployment Instructies voor Kunstcollectie App

Deze instructies helpen je om de Kunstcollectie App volledig geautomatiseerd te deployen naar Cloudflare.

## Vereisten

- Een Cloudflare account
- Node.js 18 of hoger
- Git

## Stap 1: Clone de Repository in een Nieuwe Directory

Om problemen met dubbele paden te voorkomen, is het belangrijk om de repository in een nieuwe, schone directory te klonen:

```bash
# Ga naar je home directory of een andere locatie
cd ~

# Verwijder eventuele bestaande kopieën
rm -rf kunstcollectie-app

# Clone de repository
git clone https://github.com/marcovanthiel/kunstcollectie-app.git

# Ga naar de repository directory
cd kunstcollectie-app
```

## Stap 2: Configureer Cloudflare

1. Log in bij je Cloudflare account via Wrangler:
   ```bash
   npx wrangler login
   ```
2. Volg de instructies om in te loggen bij je Cloudflare account

## Stap 3: Voer het Deployment Script Uit

```bash
node deploy-to-cloudflare.js
```

Dit script voert automatisch de volgende acties uit:
- Installeert Wrangler indien nodig
- Configureert een Cloudflare D1 database
- Maakt automatisch een wrangler.toml bestand aan voor de backend als deze niet bestaat
- Deployt de backend API als Cloudflare Worker
- Deployt de frontend applicatie naar Cloudflare Pages
- Initialiseert de database met het admin account

## Belangrijke Updates

Het deployment script is meerdere keren bijgewerkt om verschillende problemen op te lossen:

1. **Relatieve paden**: Het script gebruikt nu `__dirname` en `path.join()` om correcte relatieve paden te garanderen
2. **Backend Worker configuratie**: Het script maakt automatisch een wrangler.toml bestand aan voor de backend als deze niet bestaat
3. **Directory controle**: Het script controleert nu of de frontend en backend directories bestaan en geeft duidelijke foutmeldingen

## Stap 4: Toegang tot de Applicatie

Na succesvolle deployment kun je de applicatie bereiken op:
- Frontend: `https://kunstcollectie-app.pages.dev`
- Backend API: `https://api.projectkunst.nl`

## Inloggegevens

Je kunt inloggen met de volgende gegevens:
- Email: `marco@marcovanthiel.nl`
- Wachtwoord: `Wikkie=5`

## Problemen Oplossen

Als je problemen ondervindt tijdens de deployment:

1. **Pad problemen**: Zorg ervoor dat je het script uitvoert vanuit de hoofdmap van de repository
   ```bash
   # Controleer je huidige directory
   pwd
   # Dit zou moeten eindigen met /kunstcollectie-app
   ```

2. **Dubbele paden**: Als je foutmeldingen ziet met dubbele paden (bijv. `/Users/username/kunstcollectie-app/kunstcollectie-app/`), volg dan de instructies in Stap 1 om de repository opnieuw te klonen in een schone directory

3. **Wrangler login**: Zorg ervoor dat je bent ingelogd bij Cloudflare met Wrangler
   ```bash
   npx wrangler login
   ```

4. **Backend deployment fouten**: Als je problemen hebt met de backend deployment, controleer dan of het wrangler.toml bestand correct is aangemaakt in de backend directory

5. **Handmatige configuratie**: Als het script het wrangler.toml bestand niet correct aanmaakt, kun je het handmatig aanmaken:
   ```bash
   # In de backend directory
   cd backend
   
   # Maak wrangler.toml aan
   cat > wrangler.toml << EOL
   name = "kunstcollectie-app-api"
   compatibility_date = "2023-01-01"
   main = "src/index.js"

   [vars]
   DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/kunstcollectie"
   JWT_SECRET = "kunstcollectie_secret_key"
   JWT_EXPIRES_IN = "24h"
   EOL
   ```

## Handmatige Deployment (indien nodig)

Als je de stappen handmatig wilt uitvoeren:

### Backend Deployment
```bash
cd backend
npm install
npx prisma generate
npx wrangler deploy
```

### Database Initialisatie
```bash
cd backend
node install-database.js
```

### Frontend Deployment
```bash
cd frontend
npm install
npm run build
npx wrangler pages deploy dist --project-name=kunstcollectie-app
```

## Aanpassingen na Deployment

Als je wijzigingen wilt maken aan de applicatie na deployment:
1. Maak de wijzigingen in de code
2. Commit en push naar GitHub
3. Voer het deployment script opnieuw uit

## Veiligheid

Vergeet niet om na de eerste login het standaard wachtwoord te wijzigen voor extra veiligheid.
