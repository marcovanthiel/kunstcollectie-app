# Kunstcollectie App Deployment Handleiding

Deze handleiding bevat alle instructies voor het deployen van de Kunstcollectie App met de backend op Railway en de frontend op Cloudflare Pages.

## Inhoudsopgave

1. [Overzicht](#overzicht)
2. [Backend Deployment op Railway](#backend-deployment-op-railway)
3. [Frontend Deployment op Cloudflare Pages](#frontend-deployment-op-cloudflare-pages)
4. [Configuratie en Verbinding](#configuratie-en-verbinding)
5. [Testen en Verificatie](#testen-en-verificatie)
6. [Problemen Oplossen](#problemen-oplossen)

## Overzicht

De Kunstcollectie App bestaat uit twee hoofdcomponenten:
- **Backend**: Node.js applicatie met Express en PostgreSQL database
- **Frontend**: Vue.js/React applicatie

Vanwege compatibiliteitsproblemen met Cloudflare Workers (die geen Node.js core modules zoals 'fs' ondersteunen), deployen we:
- Backend op **Railway** (inclusief PostgreSQL database)
- Frontend op **Cloudflare Pages**

## Backend Deployment op Railway

### Stap 1: Railway Account Aanmaken

1. Ga naar [Railway.app](https://railway.app/) en klik op "Login"
2. Kies "Login with GitHub" voor de eenvoudigste setup
3. Autoriseer Railway om toegang te krijgen tot je GitHub account
4. Voltooi eventuele verificatiestappen die Railway vraagt

### Stap 2: Nieuw Project Aanmaken

1. Klik op de "New Project" knop in het Railway dashboard
2. Selecteer "Deploy from GitHub repo"
3. Kies de "marcovanthiel/kunstcollectie-app" repository
   - Als je deze niet ziet, klik dan op "Configure GitHub App" en geef toegang tot de repository
4. Klik op "Deploy Now"

### Stap 3: Backend Service Configureren

1. Nadat het project is aangemaakt, klik je op de service die is gemaakt
2. Ga naar het tabblad "Settings"
3. Scroll naar "Build & Deploy" sectie
4. Wijzig de volgende instellingen:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `npm start`
5. Klik op "Save" om de wijzigingen op te slaan

### Stap 4: PostgreSQL Database Toevoegen

1. Klik op "New" in je project dashboard
2. Selecteer "Database"
3. Kies "PostgreSQL"
4. Klik op "Add" om de database toe te voegen aan je project

### Stap 5: Omgevingsvariabelen Instellen

1. Ga naar het tabblad "Variables" van je backend service
2. Voeg de volgende variabelen toe (klik op "New Variable" voor elke):
   - `JWT_SECRET`: `kunstcollectie_secret_key_for_production`
   - `JWT_EXPIRES_IN`: `24h`
   - `DATABASE_URL`: Kopieer deze van de PostgreSQL service (ga naar de PostgreSQL service > Connect > Prisma Connection URL)

### Stap 6: Database Initialiseren

1. Ga naar het tabblad "Deployments" van je backend service
2. Klik op "Deploy" om een nieuwe deployment te starten met de bijgewerkte omgevingsvariabelen
3. Wacht tot de deployment is voltooid
4. Klik op het tabblad "Shell"
5. Voer het volgende commando uit om de database te initialiseren:
   ```bash
   node install-database.js
   ```
6. Je zou een bevestiging moeten zien dat de database succesvol is geïnitialiseerd

### Stap 7: Backend URL Noteren

1. Ga terug naar het project dashboard
2. Klik op je backend service
3. Ga naar het tabblad "Settings"
4. Scroll naar beneden naar de "Domains" sectie
5. Noteer de URL die Railway heeft toegewezen (bijv. `https://kunstcollectie-app-production.up.railway.app`)
   - Deze URL heb je nodig voor de frontend configuratie

## Frontend Deployment op Cloudflare Pages

### Stap 1: Frontend Code Aanpassen

1. Clone de repository lokaal als je dat nog niet hebt gedaan:
   ```bash
   git clone https://github.com/marcovanthiel/kunstcollectie-app.git
   cd kunstcollectie-app
   ```

2. Maak een `.env.production` bestand aan in de frontend directory:
   ```bash
   cd frontend
   echo "VITE_API_URL=https://jouw-railway-app-naam.up.railway.app" > .env.production
   ```
   Vervang `jouw-railway-app-naam` met de werkelijke naam van je Railway app.

3. Commit en push de wijzigingen naar GitHub:
   ```bash
   git add .env.production
   git commit -m "Add production environment configuration for Railway backend"
   git push origin main
   ```

### Stap 2: Cloudflare Pages Project Aanmaken

1. Log in bij je Cloudflare dashboard
2. Ga naar "Pages" in het linkermenu
3. Klik op "Create a project"
4. Kies "Connect to Git"
5. Selecteer GitHub als je Git provider
6. Autoriseer Cloudflare om toegang te krijgen tot je repositories
7. Selecteer de "marcovanthiel/kunstcollectie-app" repository

### Stap 3: Build Instellingen Configureren

1. Configureer de volgende build instellingen:
   - **Project name**: `kunstcollectie-app`
   - **Production branch**: `main`
   - **Framework preset**: `None` (of kies Vue/React afhankelijk van je frontend framework)
   - **Build command**: `cd frontend && npm install && npm run build`
   - **Build output directory**: `frontend/dist`
   - **Root directory**: `/` (laat leeg voor repository root)

2. Voeg de volgende omgevingsvariabele toe:
   - Naam: `VITE_API_URL`
   - Waarde: De Railway backend URL die je eerder hebt genoteerd

3. Klik op "Save and Deploy"

### Stap 4: Wachten op Deployment

1. Cloudflare Pages zal nu je frontend bouwen en deployen
2. Dit kan enkele minuten duren
3. Zodra voltooid, krijg je een URL waar je frontend beschikbaar is (bijv. `https://kunstcollectie-app.pages.dev`)

## Configuratie en Verbinding

### CORS Configuratie op Backend

Om ervoor te zorgen dat de frontend kan communiceren met de backend, moet je CORS correct configureren:

1. Ga naar de Railway shell van je backend service
2. Open het bestand `src/index.js` of `app.js` met een editor zoals nano of vim:
   ```bash
   nano src/index.js
   ```

3. Zoek de CORS configuratie en update deze om je Cloudflare Pages domain toe te staan:
   ```javascript
   app.use(cors({
     origin: [
       'https://kunstcollectie-app.pages.dev',
       'http://localhost:5173' // Voor lokale ontwikkeling
     ],
     credentials: true
   }));
   ```
   Vervang `kunstcollectie-app` met de werkelijke naam van je Cloudflare Pages app.

4. Sla het bestand op en sluit de editor
5. Herstart je backend service door naar het tabblad "Deployments" te gaan en op "Deploy" te klikken

## Testen en Verificatie

### Stap 1: Frontend Testen

1. Ga naar de Cloudflare Pages URL die je hebt ontvangen
2. Controleer of de frontend correct wordt geladen
3. Probeer in te loggen met de admin credentials:
   - Email: `marco@marcovanthiel.nl`
   - Wachtwoord: `Wikkie=5`

### Stap 2: Backend API Testen

1. Controleer of de frontend correct communiceert met de backend
2. Test verschillende functionaliteiten zoals:
   - Inloggen/uitloggen
   - Kunstwerken bekijken
   - Kunstwerken toevoegen (als admin)
   - Kunstenaars beheren

## Problemen Oplossen

### Frontend kan geen verbinding maken met backend

1. **CORS Fouten**: Controleer de browser console voor CORS-gerelateerde fouten
   - Zorg ervoor dat de CORS configuratie in de backend correct is ingesteld
   - Controleer of de frontend de juiste backend URL gebruikt

2. **API URL Problemen**: Controleer of de `VITE_API_URL` omgevingsvariabele correct is ingesteld
   - In Cloudflare Pages: Ga naar Settings > Environment variables
   - Lokaal: Controleer het `.env.production` bestand

3. **Backend Niet Bereikbaar**: Controleer of de Railway backend draait
   - Ga naar het Railway dashboard en controleer de status van je service
   - Probeer de backend URL direct te bezoeken in je browser

### Database Problemen

1. **Database Initialisatie Mislukt**: 
   - Controleer of de `DATABASE_URL` omgevingsvariabele correct is ingesteld
   - Probeer het `install-database.js` script opnieuw uit te voeren
   - Controleer de logs voor specifieke foutmeldingen

2. **Databaseverbinding Mislukt**:
   - Controleer of de PostgreSQL service draait in Railway
   - Controleer of de `DATABASE_URL` correct is en toegankelijk is vanaf je backend service

### Deployment Problemen

1. **Frontend Build Mislukt**:
   - Controleer de build logs in Cloudflare Pages
   - Zorg ervoor dat alle dependencies correct zijn geïnstalleerd
   - Controleer of het build command en output directory correct zijn ingesteld

2. **Backend Deployment Mislukt**:
   - Controleer de deployment logs in Railway
   - Zorg ervoor dat alle omgevingsvariabelen correct zijn ingesteld
   - Controleer of het root directory, build command en start command correct zijn ingesteld

## Conclusie

Je hebt nu succesvol de Kunstcollectie App gedeployed met de backend op Railway en de frontend op Cloudflare Pages. Deze setup biedt een goede balans tussen gebruiksgemak en controle, terwijl het de beperkingen van Cloudflare Workers omzeilt.

Je kunt inloggen met:
- Email: `marco@marcovanthiel.nl`
- Wachtwoord: `Wikkie=5`

Vergeet niet om het wachtwoord te wijzigen na de eerste login voor extra veiligheid.
