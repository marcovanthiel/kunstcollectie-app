# Kunstcollectie Applicatie

Een professionele, cloud-gebaseerde webapplicatie voor het archiveren en beheren van een kunstcollectie.

## Functionaliteiten

- Kunstwerken beheer (toevoegen, verwijderen, verkopen, uitlenen)
- Kunstenaars beheer (persoonlijke gegevens, biografie, overzicht kunstwerken)
- Locaties beheer (adresgegevens met kaartintegratie)
- Uitgebreide rapportagefunctionaliteit (overzicht, waardering, per kunstenaar, per locatie)
- Export naar verschillende formaten (PDF, DOCX, XLS, XML)
- Gebruikersbeheer met admin en read-only accounts
- Backup en herstel mogelijkheden

## Technische Specificaties

### Frontend
- React.js met Vite als build-tool
- Responsive design voor desktop, tablet en mobiele apparaten
- Chakra UI voor moderne gebruikersinterface
- Blauw, paars en groen kleurenschema

### Backend
- Node.js met Express
- RESTful API architectuur
- PostgreSQL database met Prisma ORM
- JWT authenticatie en autorisatie

### Beveiliging
- OWASP-richtlijnen implementatie
- AVG-compliance
- CSRF bescherming
- Rate limiting
- XSS bescherming

## Installatie

### Vereisten
- Node.js 18 of hoger
- PostgreSQL database

### Frontend installatie
```bash
cd frontend
npm install
npm run dev
```

### Backend installatie
```bash
cd backend
npm install
npm run dev
```

### Database setup
```bash
cd backend
npx prisma migrate dev
npx prisma generate
node src/seed.js
```

## Deployment

### Cloudflare Pages
De frontend is geconfigureerd voor deployment naar Cloudflare Pages.

```bash
cd frontend
npm run build
npx wrangler pages publish dist
```

### Backend API
De backend API kan worden gedeployed naar elke Node.js hosting provider.

## Licentie
Alle rechten voorbehouden.
