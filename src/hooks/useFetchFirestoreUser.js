import { useEffect, useState } from "react";
import { LOCALSTORAGE, USER_COLLECTION } from "../Const";
import { db } from "../firebase/config";
import handleInteraction from "../funtions/handleInteraction";

//for App.js
const useFetchFirestoreUser = () => {
	const [user, setUser] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		let unsub = () => {};

		const createUser = (userId) => {
			const userData = {
				id: userId,
				createdAt: +userId.slice(3, userId.length),
				interactionCount: 1,
				likedPalette: [],
				createdPalette: [],
			}; //initial user data

			//creating user User
			db.collection(USER_COLLECTION.collection_name)
				.doc(userId)
				.set(userData)
				.then(() => {
					console.log("db used for user Creation");
				})
				.catch((err) => {
					console.log("createUser catch", err);
					setError(err.message);
				});
		};

		const getUser = (userId) => {
			db.collection(USER_COLLECTION.collection_name)
				.doc(userId)
				.get()
				.then((snap) => {
					console.log("db used for user fetch");
					if (snap && snap.exists) {
						setUser(snap.data());
					}
				})
				.catch((err) => {
					console.log("getUser catch", err);
					setError(err.message);
				});
		};
		// const setListenerUser = (userId) => {
		// 	return db
		// 		.collection(USER_COLLECTION.collection_name)
		// 		.doc(userId)
		// 		.onSnapshot(
		// 			(doc) => {
		// 				if (doc.exists) {
		// 					console.log("user listener", doc);
		// 					setUser(doc.data());
		// 					error && setError(null);
		// 				} else {
		// 					console.log("Error: Snapshot not exist at setListenerUser");
		// 				}
		// 			},
		// 			(err) => {
		// 				console.log("setUserListener catch", err);
		// 				setError(err.message);
		// 			}
		// 		);
		// };

		handleInteraction();
		if (localStorage.getItem(LOCALSTORAGE.prefix_userId)) {
			//if old user
			const userId = localStorage.getItem(LOCALSTORAGE.prefix_userId); //geting uid
			//fetching userdata
			// unsub = setListenerUser(userId);
			getUser(userId);
		} else {
			//if new user
			const newUID = "ppu" + new Date().getTime(); //creating new user id  TODO: create randomization
			localStorage.setItem(LOCALSTORAGE.prefix_userId, newUID); //storing id
			const userId = localStorage.getItem(LOCALSTORAGE.prefix_userId); //retrieving id

			createUser(userId);
			// unsub = setListenerUser(userId);
			getUser(userId);
		}
		return () => unsub();
	}, []);

	return { user, error };
};

export default useFetchFirestoreUser;
