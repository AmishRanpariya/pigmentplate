import { useEffect, useState } from "react";
import { LOCALSTORAGE, USER_COLLECTION } from "../Const";
import { db } from "../firebase/config";

//for App.js
const useFetchFirestoreUser = () => {
	const [user, setUser] = useState(null);
	const [isPending, setIsPending] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		let unsub;

		const createProfile = (userId) => {
			const userData = {
				id: userId,
				createdAt: +userId.slice(3, userId.length),
				interactionCount: 1,
				likedPalette: [],
				createdPalette: [],
			}; //initial user data

			//creating user profile
			return db
				.collection(USER_COLLECTION.collection_name)
				.doc(userId)
				.set(userData)
				.then(() => {
					// console.log("user Created");
				})
				.catch((err) => {
					console.log(err);
					setError(err.message);
					setIsPending(false);
				});
		};

		const setListenerProfile = (userId) => {
			return db
				.collection(USER_COLLECTION.collection_name)
				.doc(userId)
				.onSnapshot(
					(doc) => {
						if (doc.exists) {
							// console.log("user listener");
							setUser(doc.data());
							setIsPending(false);
							setError(null);
						} else {
							console.log("Error: Snapshot not exist");
						}
					},
					(err) => {
						console.log(err);
						setError(err.message);
						setIsPending(false);
					}
				);
		};
		// console.log("useFetchFirestorListener ran");
		if (localStorage.getItem(LOCALSTORAGE.prefix_userId)) {
			//if old user
			const userId = localStorage.getItem(LOCALSTORAGE.prefix_userId); //geting uid
			//fetching userdata
			unsub = setListenerProfile(userId);
			localStorage.setItem(
				LOCALSTORAGE.prefix_interaction,
				+localStorage.getItem(LOCALSTORAGE.prefix_interaction) + 1
			);
		} else {
			//if new user
			const newUID = "ppu" + new Date().getTime(); //creating new user id  TODO: create randomization
			localStorage.setItem(LOCALSTORAGE.prefix_userId, newUID); //storing id
			const userId = localStorage.getItem(LOCALSTORAGE.prefix_userId); //retrieving id

			createProfile(userId);
			unsub = setListenerProfile(userId);
			localStorage.setItem(
				LOCALSTORAGE.prefix_interaction,
				+localStorage.getItem(LOCALSTORAGE.prefix_interaction) + 1
			);
		}
		return () => unsub();
	}, []);

	return { user, isPending, error };
};

export default useFetchFirestoreUser;
