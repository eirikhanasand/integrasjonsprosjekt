# Integrasjonsprosjekt
## MVP  
Link til fungerende MVP: http://10.212.168.213:8081/

## Oversikt
Dette prosjektet er et integrasjonsprosjekt som består av to hoveddeler: en backend-tjeneste og en frontend-brukergrensesnitt. Backend er bygget med Go og tilbyr API-er for funksjoner som brukerpålogging, spillmekanismer og topplister. Frontend er utviklet med React Native og TypeScript, og gir brukergrensesnittet for spillet og relaterte funksjoner.  

## Prosjektstruktur
### Backend
Backend er bygget i Go og tilbyr REST-API-er for:

- Autentisering 
- Spillhåndtering (starte spill, avslutte spill, hente poengsummer)
- Topplister
- Brukerhåndtering
Nøkkelfiler:
- api/: Inneholder API-endepunkter som game.go, leaderboard.go, oauth2.go, server.go og users.go.
- cmd/main.go: Hovedinngangspunktet for backend-tjenesten.
- service/: Inneholder tjenester for datalagring, som mongostore.go og redisstore.go.
- Dockerfile: Definerer containerbildet for backend.
- docker-compose.yml: Brukes for å sette opp og kjøre tjenesten med Docker Compose.  

### Frontend  
Frontend er bygget med React Native og gir et plattformuavhengig grensesnitt for iOS, Android og web. Den inkluderer funksjoner for:
- Pålogging og brukerpålogging
- Spillgrensesnitt og interaksjoner
- Butikk for kjøp av in-game-elementer
- Innstillinger og tilpasning
- Visning av topplister  
Nøkkelfiler:  
- src/: Inneholder kildekoden for forskjellige skjermer som game, login, menu og shop.
- redux/: Håndterer global tilstandshåndtering ved hjelp av Redux.
- styles/: Gir globale og skjermspesifikke stiler.
- utils/: Inneholder hjelpefunksjoner for forskjellige funksjoner.
## Forutsetninger
### Backend
Docker og Docker Compose  
Go 1.18 eller nyere  

### Frontend
Node.js 16 eller nyere  
npm  
Expo CLI for å kjøre React Native-prosjektet  
## Oppsett
### Backend
Installer Go-avhengigheter:
```bash
cd backend
go mod tidy
```  
Kjør med Docker Compose:
```bash
docker-compose up
```  
Backend vil være tilgjengelig på http://localhost:8080.  
### Frontend  
```bash
cd frontend
```  
Installer Node.js-avhengigheter:
```bash
npm Install
npx expo prebuild
```
Kjør frontend:
```bash
npx expo start
```  
Følg instruksjonene fra Expo for å kjøre på iOS/Android-emulatorer eller på web.