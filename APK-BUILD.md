# Android APK per GitHub Actions

Šis repo gali sugeneruoti testinį Android APK per GitHub Actions.

## Kaip paleisti

1. Įkelk į repo šiuos failus:
   - `twa-manifest.json`
   - `.github/workflows/build-android-debug-apk.yml`
2. GitHub repo atidaryk `Actions`.
3. Pasirink `Build Android Debug APK`.
4. Spausk `Run workflow`.
5. Kai build baigsis, atidaryk run puslapį ir apačioje atsisiųsk artifact `alko-vienetai-debug-apk`.
6. Išskleisk ZIP ir perkelk `alko-vienetai-debug.apk` į Android telefoną.

## Pastabos

- Tai debug APK, tinkamas testavimui telefone.
- Android gali paprašyti leisti diegimą iš nežinomų šaltinių.
- Play Store leidimui reikės release pasirašymo rakto ir signed AAB/APK.
- Kad Trusted Web Activity pilnai veiktų be naršyklės juostos, vėliau reikės `assetlinks.json` failo domeno šaknyje: `https://ldk2026.github.io/.well-known/assetlinks.json`.
- Jei workflow buvo įkeltas anksčiau ir rodė `EISDIR: illegal operation on a directory, read`, pakeisk `.github/workflows/build-android-debug-apk.yml` šia nauja versija.
