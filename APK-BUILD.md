# Android APK per GitHub Actions

Ši versija turi savarankišką GitHub Actions workflow. Jis pats build metu sugeneruoja mažą Android WebView projektą ir sukuria `debug APK`, kuris atidaro:

`https://ldk2026.github.io/alko-vienetai/`

## Ką įkelti į repo

Įkelk tik šiuos failus:

- `.github/workflows/build-android-debug-apk.yml`
- `APK-BUILD.md`

Seno `android-app/` aplanko kelti nebereikia. Jei jis repo jau yra, gali palikti: workflow prieš buildą pats ištrina ir sugeneruoja naują `android-app` aplanką.

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
