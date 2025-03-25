# Technische Architectuur Kunstcollectie-applicatie

## Overzicht

De kunstcollectie-applicatie wordt ontwikkeld als een moderne web-applicatie met een gescheiden frontend en backend architectuur. Deze architectuur zorgt voor schaalbaarheid, onderhoudbaarheid en flexibiliteit.

## Frontend Architectuur

### Technologiestack
- **Framework**: React.js
- **Build Tool**: Vite
- **State Management**: React Context API en/of Redux
- **Routing**: React Router
- **UI Componenten**: Custom componenten met mogelijk Material-UI of Chakra UI als basis
- **Styling**: CSS-in-JS (Styled Components of Emotion) met een custom thema
- **HTTP Client**: Axios voor API communicatie
- **Formulieren**: React Hook Form voor formuliervalidatie en -beheer
- **Bestandsupload**: React Dropzone

### Componentstructuur
- **Layout Components**: Header, Footer, Sidebar, Main Content
- **Page Components**: Dashboard, Kunstwerken, Kunstenaars, Locaties, Rapportages, Admin
- **Feature Components**: KunstwerkForm, KunstenaarForm, LocatieForm, etc.
- **Common Components**: Button, Input, Select, Modal, Table, Card, etc.

### Routing Structuur
- `/` - Dashboard
- `/kunstwerken` - Overzicht kunstwerken
- `/kunstwerken/nieuw` - Nieuw kunstwerk toevoegen
- `/kunstwerken/:id` - Kunstwerk details
- `/kunstwerken/:id/bewerken` - Kunstwerk bewerken
- `/kunstenaars` - Overzicht kunstenaars
- `/kunstenaars/nieuw` - Nieuwe kunstenaar toevoegen
- `/kunstenaars/:id` - Kunstenaar details
- `/kunstenaars/:id/bewerken` - Kunstenaar bewerken
- `/locaties` - Overzicht locaties
- `/locaties/nieuw` - Nieuwe locatie toevoegen
- `/locaties/:id` - Locatie details
- `/locaties/:id/bewerken` - Locatie bewerken
- `/rapportages` - Rapportages genereren
- `/admin` - Administratieve functies

## Backend Architectuur

### Technologiestack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma of Sequelize
- **Authenticatie**: JWT (JSON Web Tokens)
- **Validatie**: Joi of Zod
- **Bestandsopslag**: Cloudflare R2 Storage
- **Logging**: Winston

### API Structuur
- RESTful API met de volgende endpoints:

#### Authenticatie
- `POST /api/auth/login` - Gebruiker inloggen
- `POST /api/auth/logout` - Gebruiker uitloggen
- `GET /api/auth/me` - Huidige gebruiker ophalen

#### Kunstwerken
- `GET /api/kunstwerken` - Alle kunstwerken ophalen (met filtering en paginering)
- `GET /api/kunstwerken/:id` - Specifiek kunstwerk ophalen
- `POST /api/kunstwerken` - Nieuw kunstwerk toevoegen
- `PUT /api/kunstwerken/:id` - Kunstwerk bijwerken
- `DELETE /api/kunstwerken/:id` - Kunstwerk verwijderen
- `POST /api/kunstwerken/:id/afbeeldingen` - Afbeelding toevoegen aan kunstwerk
- `DELETE /api/kunstwerken/:id/afbeeldingen/:afbeeldingId` - Afbeelding verwijderen van kunstwerk
- `POST /api/kunstwerken/:id/bijlagen` - Bijlage toevoegen aan kunstwerk
- `DELETE /api/kunstwerken/:id/bijlagen/:bijlageId` - Bijlage verwijderen van kunstwerk

#### Kunstenaars
- `GET /api/kunstenaars` - Alle kunstenaars ophalen
- `GET /api/kunstenaars/:id` - Specifieke kunstenaar ophalen
- `POST /api/kunstenaars` - Nieuwe kunstenaar toevoegen
- `PUT /api/kunstenaars/:id` - Kunstenaar bijwerken
- `DELETE /api/kunstenaars/:id` - Kunstenaar verwijderen
- `GET /api/kunstenaars/:id/kunstwerken` - Kunstwerken van specifieke kunstenaar ophalen

#### Locaties
- `GET /api/locaties` - Alle locaties ophalen
- `GET /api/locaties/:id` - Specifieke locatie ophalen
- `POST /api/locaties` - Nieuwe locatie toevoegen
- `PUT /api/locaties/:id` - Locatie bijwerken
- `DELETE /api/locaties/:id` - Locatie verwijderen
- `GET /api/locaties/:id/kunstwerken` - Kunstwerken op specifieke locatie ophalen

#### Rapportages
- `GET /api/rapportages/overzicht` - Overzichtsrapportage genereren
- `GET /api/rapportages/waardering` - Waarderingsrapportage genereren
- `GET /api/rapportages/kunstenaar/:id` - Rapportage per kunstenaar genereren
- `GET /api/rapportages/locatie/:id` - Rapportage per locatie genereren
- `POST /api/rapportages/export` - Rapportage exporteren (DOCX, XLS, XML, PDF)

#### Administratie
- `GET /api/admin/gebruikers` - Alle gebruikers ophalen
- `GET /api/admin/gebruikers/:id` - Specifieke gebruiker ophalen
- `POST /api/admin/gebruikers` - Nieuwe gebruiker toevoegen
- `PUT /api/admin/gebruikers/:id` - Gebruiker bijwerken
- `DELETE /api/admin/gebruikers/:id` - Gebruiker verwijderen
- `POST /api/admin/import` - Data importeren (XLS)
- `GET /api/admin/backup` - Backup maken
- `POST /api/admin/restore` - Backup herstellen

### Database Schema

#### Tabellen

1. **Gebruikers**
   - id (PK)
   - email
   - wachtwoord (gehashed)
   - naam
   - rol (admin, readonly)
   - laatst_ingelogd
   - created_at
   - updated_at

2. **Kunstenaars**
   - id (PK)
   - naam
   - adres
   - postcode
   - plaats
   - land
   - telefoon
   - email
   - website
   - portretfoto_url
   - geboortedatum
   - overlijdensdatum
   - biografie
   - created_at
   - updated_at

3. **Locaties**
   - id (PK)
   - naam
   - adres
   - postcode
   - plaats
   - land
   - type_id (FK naar LocatieTypes)
   - latitude
   - longitude
   - created_at
   - updated_at

4. **LocatieTypes**
   - id (PK)
   - naam
   - beschrijving
   - created_at
   - updated_at

5. **KunstwerkTypes**
   - id (PK)
   - naam
   - beschrijving
   - created_at
   - updated_at

6. **Leveranciers**
   - id (PK)
   - naam
   - adres
   - postcode
   - plaats
   - land
   - telefoon
   - email
   - website
   - created_at
   - updated_at

7. **Kunstwerken**
   - id (PK)
   - titel
   - kunstenaar_id (FK naar Kunstenaars)
   - type_id (FK naar KunstwerkTypes)
   - hoogte
   - breedte
   - diepte
   - gewicht
   - productiedatum
   - is_schatting_datum (boolean)
   - is_editie (boolean)
   - editie_beschrijving
   - is_gesigneerd (boolean)
   - handtekening_locatie
   - beschrijving
   - locatie_id (FK naar Locaties)
   - aankoopdatum
   - aankoopprijs
   - leverancier_id (FK naar Leveranciers)
   - huidige_marktprijs
   - verzekerde_waarde
   - status (in bezit, verkocht, uitgeleend)
   - created_at
   - updated_at

8. **KunstwerkAfbeeldingen**
   - id (PK)
   - kunstwerk_id (FK naar Kunstwerken)
   - bestandsnaam
   - bestandspad
   - is_hoofdafbeelding (boolean)
   - volgorde
   - created_at
   - updated_at

9. **KunstwerkBijlagen**
   - id (PK)
   - kunstwerk_id (FK naar Kunstwerken)
   - bestandsnaam
   - bestandspad
   - bestandstype (PDF, DOCX)
   - beschrijving
   - created_at
   - updated_at

## Beveiliging

### Authenticatie en Autorisatie
- JWT-gebaseerde authenticatie
- Role-based access control (RBAC)
- HTTPS-only communicatie
- Secure cookies met HttpOnly en SameSite flags

### OWASP Beveiligingsmaatregelen
- Input validatie en sanitization
- SQL-injectie preventie via ORM
- XSS-preventie
- CSRF-bescherming
- Rate limiting
- Beveiligde wachtwoordopslag (bcrypt)
- Logging van beveiligingsgebeurtenissen

### AVG-compliance
- Gebruikerstoestemming voor gegevensverzameling
- Mogelijkheid tot data-export
- Mogelijkheid tot data-verwijdering
- Privacy by design principes
- Dataretentiebeleid

## Deployment Architectuur

### Cloudflare Deployment
- Frontend: Cloudflare Pages
- Backend: Cloudflare Workers
- Database: Cloudflare D1 of externe PostgreSQL database
- Bestandsopslag: Cloudflare R2 Storage
- Caching: Cloudflare CDN

### CI/CD Pipeline
- GitHub Actions voor automatische builds en deployments
- Automatische tests voor elke pull request
- Staging en productie-omgevingen

## Schaalbaarheid en Performance

### Schaalbaarheidsstrategieën
- Horizontale schaalbaarheid van backend services
- Caching van veelgebruikte data
- Database indexering voor snelle queries
- Lazy loading van afbeeldingen en content

### Performance Optimalisaties
- Code splitting en lazy loading in frontend
- Geoptimaliseerde afbeeldingen
- Efficiënte database queries
- CDN voor statische assets

## Backup en Disaster Recovery

### Backup Strategie
- Dagelijkse database backups
- Incrementele backups van bestandsopslag
- Backup rotatie en retentiebeleid

### Disaster Recovery
- Automatische failover mogelijkheden
- Herstelplan met gedefinieerde RTO (Recovery Time Objective) en RPO (Recovery Point Objective)
- Regelmatige disaster recovery tests
