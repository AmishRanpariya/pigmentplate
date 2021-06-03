import firebase from "firebase/app";
// import "firebase/analytics";
require("firebase/firestore");
// require("firebase/storage");

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
	apiKey: "AIzaSyDYfXf1cYY-473A6br19VGRH3uUV57V9dk",
	authDomain: "pigmentplate.firebaseapp.com",
	// databaseURL: "https://pigmentplate-default-rtdb.firebaseio.com",
	projectId: "pigmentplate",
	// storageBucket: "pigmentplate.appspot.com",
	messagingSenderId: "165063457341",
	appId: "1:165063457341:web:97aa7f2cc25391d69e0854",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();

// const projectStorage = firebase.storage();
const db = firebase.firestore();
const timestamp = firebase.firestore.FieldValue.serverTimestamp;
// export { projectStorage, projectFirestore, timestamp };
export { db, timestamp, firebase };
