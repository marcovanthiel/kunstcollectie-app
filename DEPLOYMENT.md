# Deployment Instructies voor Kunstcollectie App

Deze instructies helpen je om de Kunstcollectie App volledig geautomatiseerd te deployen naar Cloudflare.

## Vereisten

- Een Cloudflare account
- Node.js 18 of hoger
- Wrangler CLI (wordt automatisch geïnstalleerd door het deployment script)
- Git

## Stap 1: Clone de Repository

```bash
git clone https://github.com/marcovanthiel/kunstcollectie-app.git
cd kunstcollectie-app
```

## Stap 2: Configureer Cloudflare

1. Log in bij je Cloudflare account
2. Zorg dat je bent ingelogd met Wrangler:
   ```bash
   npx wrangler login
   ```
3. Volg de instructies om in te loggen bij je Cloudflare account

## Stap 3: Voer het Deployment Script Uit

```bash
node deploy-to-cloudflare.js
```

Dit script voert automatisch de volgende acties uit:
- Installeert Wrangler indien nodig
- Configureert een Cloudflare D1 database
- Deployt de backend API als Cloudflare Worker
- Deployt de frontend applicatie naar Cloudflare Pages
- Initialiseert de database met het admin account

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

1. Controleer of je bent ingelogd bij Cloudflare met Wrangler
2. Controleer of je voldoende rechten hebt in je Cloudflare account
3. Controleer de foutmeldingen in de console output

Voor lokaal testen kun je het volgende script gebruiken:
```bash
./test-local-installation.sh
```

## Handmatige Deployment (indien nodig)

Als je de stappen handmatig wilt uitvoeren:

### Backend Deployment
```bash
cd backend
npm install
npx prisma generate
npx wrangler deploy --name kunstcollectie-app-api
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
