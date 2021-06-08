import { useEffect, useState } from "react";
import { db } from "../firebase/config";

import handleInteraction from "../funtions/handleInteraction";
import { LOCALSTORAGE, USER_COLLECTION } from "../Const";
//for App.js
const useFetchFirestoreUser = () => {
	const [user, setUser] = useState(null);
	const [error, setError] = useState(null);
	useEffect(() => {
		let mounted = true;

		function createNewUserId() {
			// Public Domain/MIT
			var d = Date.now(); //Timestamp
			var d2 =
				(performance && performance.now && performance.now() * 1000) || 0; //Time in microseconds since page-load or 0 if unsupported
			return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function (c) {
				var r = Math.random() * 16; //random number between 0 and 16
				if (d > 0) {
					//Use timestamp until depleted
					r = (d + r) % 16 | 0;
					d = Math.floor(d / 16);
				} else {
					//Use microseconds since page-load if supported
					r = (d2 + r) % 16 | 0;
					d2 = Math.floor(d2 / 16);
				}
				return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
			});
		}

		const getUserIdFromLocalstorage = () => {
			return localStorage.getItem(LOCALSTORAGE.prefix_userId); //geting uid
		};
		const setUserIdToLocalstorage = (userId) => {
			localStorage.setItem(LOCALSTORAGE.prefix_userId, userId); //storing uid
		};

		const createUser = (userId) => {
			const timenow = Date.now();
			const userData = {
				id: userId,
				createdAt: timenow,
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
					mounted && setUser(userData);
				})
				.catch((err) => {
					console.log("createUser catch", err);
					mounted && setError(err.message);
				});
		};

		const getUser = (userId) => {
			db.collection(USER_COLLECTION.collection_name)
				.doc(userId)
				.get()
				.then((snap) => {
					console.log("db used for user fetch");
					if (snap && snap.exists) {
						mounted && setUser(snap.data());
					} else if (snap && !snap.exists) {
						console.log("user depricated so new creating");
						//means can not find user in firestore with given userId
						//means userId is depricated
						// so create new userId
						//save it to localstorage and createUser then getUser.
						const newUID = createNewUserId();
						setUserIdToLocalstorage(newUID);
						createUser(newUID);
					}
				})
				.catch((err) => {
					console.log("getUser catch", err, err.message);
					mounted && setError(err.message);
				});
		};

		handleInteraction();
		if (getUserIdFromLocalstorage()) {
			//means old user
			const userId = getUserIdFromLocalstorage();
			getUser(userId);
		} else {
			//means new user
			const newUID = createNewUserId();
			setUserIdToLocalstorage(newUID);
			createUser(newUID);
		}

		return () => {
			mounted = false;
		};
	}, []);

	return { user, error };
};

export default useFetchFirestoreUser;
