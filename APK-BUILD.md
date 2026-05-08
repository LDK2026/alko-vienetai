# Android APK per GitHub Actions

Šis repo gali sugeneruoti testinį Android APK per GitHub Actions.

## Kaip paleisti

1. Įkelk į repo šiuos failus:
   - `twa-manifest.json`
   - `.github/workflows/build-android-debug-apk.yml`
2. GitHub repo atidaryk `Actions`.
3. Pasirink `Build Android Debug APK`.
4. Spausk `Run workflow`.
5. Kai build baigsis, atidaryk run puslapį ir apačioje atsisiųsk artifact `alko-vienetai-unsigned-apk`.
6. Išskleisk ZIP. Viduje bus `alko-vienetai-unsigned.apk`.

## Pastabos

- Tai unsigned APK, skirtas techniniam build patikrinimui.
- Android gali paprašyti leisti diegimą iš nežinomų šaltinių.
- Jeigu Android atsisako diegti unsigned APK, kitas žingsnis yra pridėti GitHub Secrets su keystore slaptažodžiais ir generuoti signed APK.
- Play Store leidimui reikės release pasirašymo rakto ir signed AAB/APK.
- Kad Trusted Web Activity pilnai veiktų be naršyklės juostos, vėliau reikės `assetlinks.json` failo domeno šaknyje: `https://ldk2026.github.io/.well-known/assetlinks.json`.
- Jei workflow buvo įkeltas anksčiau ir rodė `EISDIR: illegal operation on a directory, read`, pakeisk `.github/workflows/build-android-debug-apk.yml` šia nauja versija.
- Jei workflow buvo įkeltas anksčiau ir rodė `./gradlew: No such file or directory`, pakeisk `.github/workflows/build-android-debug-apk.yml` šia nauja versija.
