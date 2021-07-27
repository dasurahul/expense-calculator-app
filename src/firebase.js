import firebase from "firebase/app";
import "firebase/firestore";

var firebaseConfig = {
  apiKey: "AIzaSyCXJW0DXCZwq8MPYqbC4FScnh5dNKmlDfY",
  authDomain: "shopping-website-react.firebaseapp.com",
  databaseURL: "https://shopping-website-react-default-rtdb.firebaseio.com",
  projectId: "shopping-website-react",
  storageBucket: "shopping-website-react.appspot.com",
  messagingSenderId: "554920291655",
  appId: "1:554920291655:web:ecf17183e3073f8203f062",
  measurementId: "G-5RXWYVKK92",
};

firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();

export default db;
