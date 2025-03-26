# Frontend Configuratie voor Railway Backend

Dit bestand bevat instructies voor het configureren van de frontend om te werken met de Railway backend.

## Omgevingsvariabelen

De frontend gebruikt een omgevingsvariabele `VITE_API_URL` om de backend API URL te configureren. Deze variabele moet worden ingesteld op de URL van je Railway backend.

### Lokale Ontwikkeling

Voor lokale ontwikkeling, maak een `.env.local` bestand aan in de frontend directory:

```
VITE_API_URL=https://jouw-railway-app-naam.up.railway.app
```

Vervang `jouw-railway-app-naam` met de werkelijke naam van je Railway app.

### Cloudflare Pages Deployment

Voor Cloudflare Pages deployment, moet je de omgevingsvariabele instellen in het Cloudflare dashboard:

1. Ga naar het Cloudflare dashboard
2. Navigeer naar Pages > jouw-project
3. Ga naar het tabblad "Settings" > "Environment variables"
4. Voeg een nieuwe variabele toe:
   - Naam: `VITE_API_URL`
   - Waarde: `https://jouw-railway-app-naam.up.railway.app`
5. Kies "Production" en "Preview" voor de environments
6. Klik op "Save"

## CORS Configuratie

Zorg ervoor dat je backend CORS correct heeft geconfigureerd om verzoeken van je Cloudflare Pages domain toe te staan. In je backend `src/index.js` of `app.js` bestand, moet je de CORS configuratie bijwerken:

```javascript
// Voorbeeld CORS configuratie
app.use(cors({
  origin: [
    'https://jouw-cloudflare-pages-app.pages.dev',
    'http://localhost:5173' // Voor lokale ontwikkeling
  ],
  credentials: true
}));
```

Vervang `jouw-cloudflare-pages-app` met de werkelijke naam van je Cloudflare Pages app.

## API Endpoints

De frontend gebruikt de volgende API endpoints:

- Auth: `/api/auth/*`
- Kunstwerken: `/api/kunstwerken/*`
- Kunstenaars: `/api/kunstenaars/*`
- Locaties: `/api/locaties/*`
- Rapportages: `/api/rapportages/*`
- Admin: `/api/admin/*`

Zorg ervoor dat je Railway backend deze endpoints correct implementeert.

## Testen

Na het configureren van de omgevingsvariabelen, test de verbinding tussen frontend en backend:

1. Start de frontend lokaal: `cd frontend && npm run dev`
2. Probeer in te loggen met de admin credentials
3. Controleer de browser console voor eventuele CORS of API verbindingsfouten
