import firebase from 'firebase';
import react from 'react';
var config = {
    apiKey: "AIzaSyDuVspfaicp9njjoeIBiTo7sevDTbra780",
    authDomain: "tutorns-192617.firebaseapp.com",
    databaseURL: "https://tutorns-192617.firebaseio.com",
    projectId: "tutorns-192617",
    storageBucket: "tutorns-192617.appspot.com",
    messagingSenderId: "755758836836"
};
 firebase.initializeApp(config);
 export default firebase;