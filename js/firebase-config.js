/* =========================================================
   FIREBASE CONFIG — E-CENTER TIKAPUR
   =========================================================
   1. Go to https://console.firebase.google.com
   2. Create a new project (free "Spark" plan is enough)
   3. Project settings (gear icon) → General → "Your apps" →
      click the </> (web) icon → register app → copy the
      firebaseConfig object it gives you → paste the values
      below, replacing every "REPLACE_ME".
   4. In the Firebase console, enable:
      - Build → Firestore Database → Create database (production mode)
      - Build → Authentication → Sign-in method → Email/Password → Enable
      - Then Authentication → Users → Add user → create YOUR admin
        login (this is the email/password you'll use on admin.html)
   5. Firestore → Rules tab → paste the rules from
      FIRESTORE_RULES.txt (included in this zip) → Publish.

   You only need to do this ONCE. After that, everything
   (products, leads) is managed live from admin.html — no
   coding needed, and no cost on normal showroom traffic.
   ========================================================= */

// const firebaseConfig = {
//   apiKey: "REPLACE_ME",
//   authDomain: "REPLACE_ME.firebaseapp.com",
//   projectId: "REPLACE_ME",
//   storageBucket: "REPLACE_ME.appspot.com",
//   messagingSenderId: "REPLACE_ME",
//   appId: "REPLACE_ME"
// };

// firebase.initializeApp(firebaseConfig);
// const db = firebase.firestore();
// const auth = firebase.auth();

// const firebaseConfig = {
//   apiKey: "AIzaSyABCwh9l_ulGSvpdZhIW3gizl2IjJgRJ5A",
//   authDomain: "e-center-tikapur.firebaseapp.com",
//   projectId: "e-center-tikapur",
//   storageBucket: "e-center-tikapur.firebasestorage.app",
//   messagingSenderId: "768105604060",
//   appId: "1:768105604060:web:392758527b80316c356519",
//   measurementId: "G-4Z2R0WTWCW"
// };

// firebase.initializeApp(firebaseConfig);

// const auth = firebase.auth();
// const db = firebase.firestore();






const firebaseConfig = {
  apiKey: "AIzaSyABCwh9l_ulGSvpdZhIW3gizl2IjJgRJ5A",
  authDomain: "e-center-tikapur.firebaseapp.com",
  projectId: "e-center-tikapur",
  storageBucket: "e-center-tikapur.firebasestorage.app",
  messagingSenderId: "768105604060",
  appId: "1:768105604060:web:392758527b80316c356519",
  measurementId: "G-4Z2R0WTWCW"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();