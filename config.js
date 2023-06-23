import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';


const firebaseConfig = {
    apiKey: "AIzaSyAzqYhumQRSAhn-GqBJ62ie6qeybBzLA3Q",
    authDomain: "davcuapplication.firebaseapp.com",
    projectId: "davcuapplication",
    storageBucket: "davcuapplication.appspot.com",
    messagingSenderId: "578522585878",
    appId: "1:578522585878:web:3b33670554e34565cf8e37",
    measurementId: "G-QYSQ1CLLKR"
}

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };