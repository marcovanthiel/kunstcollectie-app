# Vereisten Kunstcollectie-applicatie

## Algemene eisen

- Cloud-gebaseerde applicatie, geïnstalleerd op Cloudflare
- Gescheiden front-end (gebruikersinterface) en back-end (server-side verwerking en databasebeheer)
- Schaalbare architectuur die eenvoudig kan worden uitgebreid
- Geoptimaliseerde prestaties, snelle laadtijden en hoge betrouwbaarheid (uptime > 99,9%)
- Beveiliging volgens OWASP-richtlijnen
- Adequate back-upvoorzieningen en disaster recovery procedures
- Volledige naleving van de AVG-wetgeving

## Front-end specificaties

- Moderne, responsieve gebruikersinterface geschikt voor desktop, tablet en mobiele apparaten
- Ontwikkeld met React.js, gebruikmakend van Vite als build-tool
- Gebruiksvriendelijke navigatie en intuïtieve gebruikerservaring
- Moderne layout met veel grafische elementen en animaties
- Consistente stijl met blauw, paars en groen als hoofdkleuren

## Back-end specificaties

- Robuuste en veilige back-end, bij voorkeur Node.js, Python (Django of Flask) of vergelijkbare technologie
- RESTful API-architectuur voor communicatie tussen front-end en back-end
- Gestructureerde en genormaliseerde database, bij voorkeur PostgreSQL of MySQL
- Automatische schaalbaarheid en mogelijkheden voor load balancing

## Functionaliteiten

### Kunstwerken

Gebruikers moeten in staat zijn om:
- Nieuwe kunstwerken toe te voegen
- Kunstwerken te verwijderen, verkopen of uitlenen
- Van elk kunstwerk de volgende informatie te beheren:
  - Kunstenaar (selecteerbaar uit lijst of mogelijkheid tot toevoegen)
  - Type kunstwerk (selecteerbaar uit lijst of mogelijkheid tot toevoegen)
  - Maximaal 15 foto's per kunstwerk, één hoofdafbeelding
  - Afmetingen in cm (hoogte, breedte, diepte) en gewicht
  - Productiedatum (met optie voor schatting)
  - Editie (ja/nee) met aanvullende beschrijving
  - Gesigneerd (ja/nee) en beschrijving locatie handtekening
  - Tekstuele beschrijving van het kunstwerk
  - Locatie (selecteerbaar uit lijst of mogelijkheid tot toevoegen)
  - Aankoopdatum, aankoopprijs, leverancier (selecteerbaar uit lijst)
  - Huidige marktprijs en verzekerde waarde
  - Bijlagen in PDF- en DOCX-formaat

### Kunstenaars

Van elke kunstenaar wordt beheerd:
- Naam, adres, woonplaats, land en contactgegevens
- Website
- Portretfoto
- Geboorte- en overlijdensdatum
- Biografie (vrij tekstveld)
- Overzichtspagina met geregistreerde kunstwerken
- Optie tot toevoegen en wijzigen van kunstenaars

### Locaties

Van elke locatie wordt beheerd:
- Adresgegevens met geïntegreerde kaart
- Type locatie (selecteerbaar uit lijst of mogelijkheid tot toevoegen)
- Overzicht van kunstwerken per locatie
- Optie tot toevoegen en wijzigen van locaties

### Rapportages

Uitgebreide rapportagefunctionaliteit:
- Overzichtsrapportage kunstwerken (selecteerbare velden uit database)
- Waarderingsrapportage met totaalwaarde en uitsplitsing per kunstenaar, locatie en type
- Rapportages per locatie en per kunstenaar
- Exportmogelijkheden naar DOCX, XLS, XML en PDF in professionele lay-out

### Administratieve functionaliteiten

- Gebruikersbeheer met admin-accounts (volledige rechten) en read-only accounts
- XLS-import en exportmogelijkheden voor kunstwerken, kunstenaars en locaties (inclusief voorbeeld-importbestand)
- Automatische back-ups met herstelopties

## Hostingvereisten

- Hosting bij Cloudflare, compatibel met React (Vite) als framework
- Applicatie voldoet aan technische vereisten voor optimale prestaties binnen Cloudflare-infrastructuur

## Compatibiliteit

- Voorbereid voor toekomstige uitbreiding met mobiele applicatie (iOS, Android)

## Versiebeheer

- Zorg ervoor dat de gehele website wordt geüpload naar GitHub
