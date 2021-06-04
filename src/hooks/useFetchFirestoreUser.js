import { useEffect, useState } from "react";
import { LOCALSTORAGE, USER_COLLECTION } from "../Const";
import { db } from "../firebase/config";

//for App.js
const useFetchFirestoreUser = () => {
	const [user, setUser] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		let unsub;

		const createUser = (userId) => {
			const userData = {
				id: userId,
				createdAt: +userId.slice(3, userId.length),
				interactionCount: 1,
				likedPalette: [],
				createdPalette: [],
			}; //initial user data

			//creating user User
			return db
				.collection(USER_COLLECTION.collection_name)
				.doc(userId)
				.set(userData)
				.then(() => {
					console.log("user Created");
				})
				.catch((err) => {
					console.log(err);
					setError(err.message);
				});
		};

		const getUser = (userId) => {
			return db
				.collection(USER_COLLECTION.collection_name)
				.doc(userId)
				.get()
				.then((snap) => {
					console.log("user fetched");
					if (snap && snap.exists) {
						setUser(snap.data());
					}
				})
				.catch((err) => {
					console.log(err);
					setError(err.message);
				});
		};
		const setListenerUser = (userId) => {
			return db
				.collection(USER_COLLECTION.collection_name)
				.doc(userId)
				.onSnapshot(
					(doc) => {
						if (doc.exists) {
							console.log("user listener", doc);
							setUser(doc.data());
							error && setError(null);
						} else {
							console.log("Error: Snapshot not exist");
						}
					},
					(err) => {
						console.log(err);
						setError(err.message);
					}
				);
		};
		// console.log("useFetchFirestorListener ran");
		if (localStorage.getItem(LOCALSTORAGE.prefix_userId)) {
			//if old user
			const userId = localStorage.getItem(LOCALSTORAGE.prefix_userId); //geting uid
			//fetching userdata
			// unsub = setListenerUser(userId);
			unsub = getUser(userId);
			localStorage.setItem(
				LOCALSTORAGE.prefix_interaction,
				+localStorage.getItem(LOCALSTORAGE.prefix_interaction) + 1
			);
		} else {
			//if new user
			const newUID = "ppu" + new Date().getTime(); //creating new user id  TODO: create randomization
			localStorage.setItem(LOCALSTORAGE.prefix_userId, newUID); //storing id
			const userId = localStorage.getItem(LOCALSTORAGE.prefix_userId); //retrieving id

			createUser(userId);
			// unsub = setListenerUser(userId);
			unsub = getUser(userId);
			localStorage.setItem(
				LOCALSTORAGE.prefix_interaction,
				+localStorage.getItem(LOCALSTORAGE.prefix_interaction) + 1
			);
		}
		return () => unsub();
	}, []);

	return { user, error };
};

export default useFetchFirestoreUser;
