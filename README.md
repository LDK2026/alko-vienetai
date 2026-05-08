# Alko Vienetai

Alko Vienetai yra paprasta PWA programėlė alkoholio vienetams skaičiuoti ir vartojimo istorijai saugoti naršyklėje.

## Funkcijos

- Gėrimo kiekio, stiprumo ir alkoholio vienetų skaičiavimas.
- Dienos ir paskutinių 7 dienų suvestinė.
- Gėrimų istorija su pavienių įrašų trynimu.
- Pasirenkamos dienos ir savaitės ribos.
- PWA manifestas, service worker ir offline puslapis.

## Failai

- `index.html` - programėlės struktūra.
- `styles.css` - pilnas programėlės dizainas.
- `app.js` - skaičiavimai, istorija, statistika ir nustatymai.
- `manifest.webmanifest` - PWA konfigūracija.
- `service-worker.js` - cache ir offline veikimas.
- `offline.html` - rodomas, kai puslapis nepasiekiamas be interneto.

## Įkėlimas į GitHub Pages

1. Įkelk šiuos failus į repo šaknį.
2. Palik esamas PNG ikonas `assets/` aplanke ir SVG gėrimų paveikslėlius repo šaknyje.
3. GitHub repo nustatymuose įjunk Pages iš `main` branch ir root aplanko.
4. Po publikavimo atidaryk `https://ldk2026.github.io/alko-vienetai/`.

Duomenys saugomi tik vartotojo naršyklės `localStorage`.
