# Firebase setup

The storefront reads its product catalog from Cloud Firestore. Admin changes are shared with visitors after they are saved.

1. Create a Firebase project and register a Web app in the Firebase console.
2. Copy `.env.example` to `.env.local` and fill in the Web app config values from **Project settings → General → Your apps**. Do not commit `.env.local`.
3. In **Authentication → Sign-in method**, enable **Email/Password**. In **Users**, add the admin account. Public account creation is not available in this app.
4. Create a Cloud Firestore database.
5. In **Firestore → Rules**, publish the rules from [`firestore.rules`](./firestore.rules). Before publishing, replace `admin@example.com` with the exact email address of the admin account you created. The rules allow public reads for the storefront and writes only for that authenticated email.
6. Add `sruti0629.github.io` to **Authentication → Settings → Authorized domains** if it is not already listed.
7. Restart the development server after changing `.env.local`. For the live GitHub Pages site, build and deploy with the same Firebase configuration available to the build.

After Firebase is connected, sign in at `/#/admin` and add products to Firestore. If this browser has products saved from the local-storage version, the admin panel offers an **Import local products to Firebase** button. Products saved in another browser or on another origin cannot be read by this site.
