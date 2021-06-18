import firebase from "firebase/app";
// import "firebase/analytics";
require("firebase/firestore");
require("firebase/auth");
require("firebase/analytics");

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
	apiKey: "AIzaSyDYfXf1cYY-473A6br19VGRH3uUV57V9dk",
	authDomain: "pigmentplate.firebaseapp.com",
	databaseURL: "https://pigmentplate-default-rtdb.firebaseio.com",
	projectId: "pigmentplate",
	storageBucket: "pigmentplate.appspot.com",
	messagingSenderId: "165063457341",
	appId: "1:165063457341:web:97aa7f2cc25391d69e0854",
	measurementId: "G-9Q4YL6F43V",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

firebase
	.firestore()
	.enablePersistence()
	.catch((err) => {
		if (err.code === "failed-precondition") {
			console.log(
				"offline data persistence can not enable due to multiple tabs"
			);
			// Multiple tabs open, persistence can only be enabled
			// in one tab at a a time.
			// ...
		} else if (err.code === "unimplemented") {
			console.log(
				"offline data persistence can not enable due to unsupported browser"
			);
			// The current browser does not support all of the
			// features required to enable persistence
			// ...
		}
	});
const db = firebase.firestore();
const auth = firebase.auth();
const fa = firebase.analytics();
const Timestamp = firebase.firestore.Timestamp;
const timestamp = firebase.firestore.FieldValue.serverTimestamp;
export { db, timestamp, firebase, auth, fa, Timestamp };
