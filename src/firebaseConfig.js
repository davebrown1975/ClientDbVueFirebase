import firebase from "firebase";
import "firebase/firestore";

// firebase init goes here 

// OBTAIN THE CONFIG FROM YOUR FIREBASE CONSOLE, ONCE YOU ADD AN APP, THESE WILL BE PRESENTED TO YOU.

const config = { 
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};
firebase.initializeApp(config);
firebase.analytics();

// firebase utils
const db = firebase.firestore();
const auth = firebase.auth();
const currentUser = auth.currentUser;

// firebase collections
const usersCollection = db.collection("users");
const clientsCollection = db.collection("clients");

export { db, auth, currentUser, usersCollection, clientsCollection };
