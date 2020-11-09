import firebase from 'firebase/app'
import 'firebase/firestore'

var firebaseConfig = {
    apiKey: "AIzaSyCkVPlDBuFnz_g_f4n9Ff-qRFyqTPzv9FA",
    authDomain: "reactriv-21adc.firebaseapp.com",
    databaseURL: "https://reactriv-21adc.firebaseio.com",
    projectId: "reactriv-21adc",
    storageBucket: "reactriv-21adc.appspot.com",
    messagingSenderId: "815912492065",
    appId: "1:815912492065:web:59bdeaad1f66cf0e0d5760",
    measurementId: "G-PGR587SX83"
}

if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
}

export default firebase