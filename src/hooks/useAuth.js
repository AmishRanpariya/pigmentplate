import { useEffect, useState } from "react";
import { auth, db, timestamp } from "../firebase/config";

import handleInteraction from "../funtions/handleInteraction";
import { LOCALSTORAGE, USER_COLLECTION } from "../Const";

//for App.js
const useAuth = () => {
	const [user, setUser] = useState(null);
	const [userAuth, setUserAuth] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		let mounted = true;

		const setUserCache = (data) => {
			localStorage.setItem(
				LOCALSTORAGE.prefix_cached_user,
				JSON.stringify(data)
			);
		};

		const createUser = (userId) => {
			const userData = {
				id: userId,
				createdAt: timestamp(),
				interactionCount: 1,
				likedPalette: [],
				createdPalette: [],
				lastActivityAt: timestamp(),
			}; //initial user data

			//creating user User
			db.collection(USER_COLLECTION.collection_name)
				.doc(userId)
				.set(userData)
				.then(() => {
					console.log("db used for user Creation");
					setUserCache({
						...userData,
						createdAt: { seconds: Date.now() / 1000 },
					});
					mounted &&
						setUser({ ...userData, createdAt: { seconds: Date.now() / 1000 } });
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
						setUserCache(snap.data());
						mounted && setUser(snap.data());
					} else if (snap && !snap.exists) {
						console.log("user depricated so new creating");
						//means can not find user in firestore with given userId
						//means userId is depricated
						// so create new user
						// setUserIdToLocalstorage(userId);
						createUser(userId);
					}
				})
				.catch((err) => {
					console.log("getUser catch", err, err.message);
					mounted && setError(err.message);
				});
		};

		const signInAnon = () => {
			auth
				.signInAnonymously()
				.then(() => {
					console.log("signed in anon");
				})
				.catch((err) => {
					console.log("sign in error", err);
					handleInteraction("err_in_signing_in", { err: err.message });
				});
		};

		const listenAuthStateChanges = () => {
			auth.onAuthStateChanged((_userAuth) => {
				if (_userAuth) {
					console.log("logged in");
					handleInteraction("user_signed_in");
					// get that userData
					// if not exist we will create it in getUser
					// else data will be fetched
					getUser(_userAuth.uid);
					setUserAuth(_userAuth);
				} else {
					console.log("not signed in till now");
				}
			});
		};

		signInAnon();
		listenAuthStateChanges();

		return () => {
			mounted = false;
		};
	}, []);

	return { user, userAuth, error };
};

export default useAuth;
