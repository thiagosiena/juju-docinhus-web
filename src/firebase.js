import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAkEBZH4-dQcwH7aedF_7CER8RmusgAYEA",
    authDomain: "juju-docinhus-app.firebaseapp.com",
    projectId: "juju-docinhus-app",
    storageBucket: "juju-docinhus-app.firebasestorage.app",
    messagingSenderId: "771263245355",
    appId: "1:771263245355:web:4ab1b721a7a5648ef10e6e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };