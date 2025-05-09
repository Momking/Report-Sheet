import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCwS_ZOZxu-2CmpMi55n7FTSVOmvZ9CwnI",
  authDomain: "fir-project-ac28e.firebaseapp.com",
  projectId: "fir-project-ac28e",
  storageBucket: "fir-project-ac28e.appspot.com",
  messagingSenderId: "474546244853",
  appId: "1:474546244853:web:dce6eeabcabb04587789bc",
  measurementId: "G-RSCXDZCEE3",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);
export { app, auth, db, storage };
