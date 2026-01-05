<!-- web -->

npm run dev

<!-- app -->

npm run build:mobile
npx cap sync android
npx cap open android
cd android
.\gradlew assembleDebug
