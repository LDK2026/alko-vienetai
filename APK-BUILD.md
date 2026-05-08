# Android APK per GitHub Actions

Šis rinkinys sukuria paprastą Android WebView programėlę, kuri atidaro:

`https://ldk2026.github.io/alko-vienetai/`

Tai ne Bubblewrap/TWA buildas. Šitas kelias yra paprastesnis ir skirtas greitai gauti į telefoną įdiegiamą `debug APK`.

## Ką įkelti į repo

Įkelk šiuos failus ir aplankus į repo šaknį:

- `.github/workflows/build-android-debug-apk.yml`
- `android-app/`
- `APK-BUILD.md`

Jei repo jau turi seną `.github/workflows/build-android-debug-apk.yml`, pakeisk jį šia nauja versija.

## Kaip sugeneruoti APK

1. GitHub repo atidaryk `Actions`.
2. Pasirink `Build Android Debug APK`.
3. Spausk `Run workflow`.
4. Kai workflow baigsis, atidaryk run puslapį.
5. Apačioje atsisiųsk artifact `alko-vienetai-debug-apk`.
6. ZIP viduje bus `alko-vienetai-debug.apk`.

## Kaip įdiegti telefone

1. Perkelk `alko-vienetai-debug.apk` į Android telefoną.
2. Atidaryk APK telefone.
3. Jei Android prašo, leisk diegimą iš nežinomų šaltinių.

## Pastabos

- Tai `debug APK`, tinkamas testavimui.
- Programėlė naudoja Android WebView ir atidaro viešą PWA puslapį.
- Play Store leidimui vėliau reikės signed release APK/AAB.
- Jei nori pilnos Trusted Web Activity versijos be WebView, reikės tvarkyti TWA/Bubblewrap ir `assetlinks.json`.
