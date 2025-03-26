#!/bin/bash
# Lokaal test script voor de kunstcollectie-app installatie
# Dit script test de database installatie en applicatie setup lokaal

echo "Start lokale test van kunstcollectie-app installatie..."

# Maak een .env bestand aan voor de backend
echo "Aanmaken van .env bestand voor backend..."
cat > ./backend/.env << EOL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/kunstcollectie_test"
JWT_SECRET="test_secret_key"
JWT_EXPIRES_IN="24h"
EOL

echo "Controleren of PostgreSQL is geïnstalleerd..."
if ! command -v psql &> /dev/null; then
    echo "PostgreSQL is niet geïnstalleerd. Installeren van PostgreSQL..."
    sudo apt-get update
    sudo apt-get install -y postgresql postgresql-contrib
    echo "PostgreSQL geïnstalleerd."
fi

echo "Controleren of PostgreSQL service draait..."
if ! systemctl is-active --quiet postgresql; then
    echo "PostgreSQL service is niet actief. Service starten..."
    sudo systemctl start postgresql
    echo "PostgreSQL service gestart."
fi

echo "Aanmaken van test database..."
sudo -u postgres psql -c "DROP DATABASE IF EXISTS kunstcollectie_test;"
sudo -u postgres psql -c "CREATE DATABASE kunstcollectie_test;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE kunstcollectie_test TO postgres;"

echo "Installeren van backend dependencies..."
cd backend
npm install

echo "Testen van database installatie script..."
node install-database.js

if [ $? -eq 0 ]; then
    echo "Database installatie succesvol!"
else
    echo "Database installatie mislukt!"
    exit 1
fi

echo "Starten van backend server voor test..."
node src/index.js &
BACKEND_PID=$!
echo "Backend server gestart met PID: $BACKEND_PID"

# Wacht even tot de server is opgestart
sleep 5

echo "Installeren van frontend dependencies..."
cd ../frontend
npm install

echo "Bouwen van frontend applicatie..."
npm run build

if [ $? -eq 0 ]; then
    echo "Frontend build succesvol!"
else
    echo "Frontend build mislukt!"
    kill $BACKEND_PID
    exit 1
fi

echo "Stoppen van backend server..."
kill $BACKEND_PID

echo "Lokale test voltooid! Alles werkt naar verwachting."
echo "Je kunt nu de wijzigingen committen en pushen naar GitHub."
echo "Daarna kan de applicatie worden gedeployed naar Cloudflare met het deploy-to-cloudflare.js script."
