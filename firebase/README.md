# Firebase Config Files

Place your platform-specific Firebase configuration files in this folder:

- `google-services.json` — downloaded from Firebase Console for your Android app
- `GoogleService-Info.plist` — downloaded from Firebase Console for your iOS app

Both files are referenced in `app.json` under `expo.android.googleServicesFile` and
`expo.ios.googleServicesFile`. They are already listed in `.gitignore` and must
**never** be committed to version control.

See the main project `README.md` for full Firebase setup instructions.
