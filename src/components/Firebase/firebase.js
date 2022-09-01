import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const config = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL ,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ,
    messagingSenderId:process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID ,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
};

class Firebase {
    constructor() {
        app.initializeApp(config);
        this.auth = app.auth();
        this.db = app.firestore();
    }

    //inscription
    signupUser = (email,pwd) => {
        return this.auth.createUserWithEmailAndPassword(email,pwd);
    }
    //connexion
    loginUser = (email,pwd) => {
       return this.auth.signInWithEmailAndPassword(email,pwd);
    }
    //deconnexion
    signoutUser = () =>this.auth.signOut();

    //recuperer mot de passe
    passwordReset = (email) => {
        return this.auth.sendPasswordResetEmail(email);
    }

    user = (uid) => {
        return this.db.doc(`users/${uid}`);
    }
}


export default Firebase;