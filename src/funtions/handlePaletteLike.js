import { db, firebase, timestamp } from "../firebase/config";

import { LOCALSTORAGE, PALETTE_COLLECTION, USER_COLLECTION } from "../Const";
import handleInteraction from "./handleInteraction";

//for
//DetailedPalette.js
//Palette.js
const handlePaletteLike = (
	paletteId,
	userId = null,
	shouldUpdate = 0,
	callback = () => {}
) => {
	let palette = {};
	const likePalette = () => {
		// Get a new write batch
		let batch = db.batch();

		let userRef = db.collection(USER_COLLECTION.collection_name).doc(userId);
		batch.update(userRef, {
			interactionCount: firebase.firestore.FieldValue.increment(1),
			likedPalette: firebase.firestore.FieldValue.arrayUnion(paletteId),
			lastActivityAt: timestamp(),
		});

		let paletteRef = db
			.collection(PALETTE_COLLECTION.collection_name)
			.doc(paletteId);
		batch.update(paletteRef, {
			interactionCount: firebase.firestore.FieldValue.increment(1),
			// likedBy: firebase.firestore.FieldValue.arrayUnion(userId),
			likeCount: firebase.firestore.FieldValue.increment(1),
		});

		// Commit the batch
		batch
			.commit()
			.then(() => {
				// console.log("db used for palette liked");
				getPalette(paletteId);
				const _user = JSON.parse(
					localStorage.getItem(LOCALSTORAGE.prefix_cached_user)
				);
				_user.likedPalette.push(paletteId);

				localStorage.setItem(
					LOCALSTORAGE.prefix_cached_user,
					JSON.stringify(_user)
				);
			})
			.catch((err) => {
				console.log("likePalette catch", err);
			});
	};

	const dislikePalette = () => {
		// Get a new write batch
		let batch = db.batch();

		let userRef = db.collection(USER_COLLECTION.collection_name).doc(userId);
		batch.update(userRef, {
			interactionCount: firebase.firestore.FieldValue.increment(1),
			likedPalette: firebase.firestore.FieldValue.arrayRemove(paletteId),
			lastActivityAt: timestamp(),
		});

		let paletteRef = db
			.collection(PALETTE_COLLECTION.collection_name)
			.doc(paletteId);
		batch.update(paletteRef, {
			interactionCount: firebase.firestore.FieldValue.increment(1),
			// likedBy: firebase.firestore.FieldValue.arrayRemove(userId),
			likeCount: firebase.firestore.FieldValue.increment(-1),
		});

		// Commit the batch
		batch
			.commit()
			.then(() => {
				// console.log("db used for palette unliked");
				getPalette(paletteId);
				const _user = JSON.parse(
					localStorage.getItem(LOCALSTORAGE.prefix_cached_user)
				);
				_user.likedPalette = _user.likedPalette.filter(
					(id) => id !== paletteId
				);
				localStorage.setItem(
					LOCALSTORAGE.prefix_cached_user,
					JSON.stringify(_user)
				);
			})
			.catch((err) => {
				console.log("disLikePalette catch", err);
			});
	};

	const getPalette = (paletteId) => {
		let localData;
		if (localStorage.getItem(LOCALSTORAGE.prefix_cached_palettes)) {
			localData = JSON.parse(
				localStorage.getItem(LOCALSTORAGE.prefix_cached_palettes)
			);
		}
		db.collection(PALETTE_COLLECTION.collection_name)
			.doc(paletteId)
			.get()
			.then((snap) => {
				// console.log("db used for fetching palette");
				if (snap && snap.exists) {
					callback(snap.data());
					palette = snap.data();

					const paletteIndex = localData.findIndex(
						(palette) => palette.id === paletteId
					);
					if (paletteIndex >= 0 && paletteIndex < localData.length) {
						localData[paletteIndex] = {
							id: snap.get("id"),
							colors: snap.get("colors"),
							createdAt: snap.get("createdAt"),
							likeCount: snap.get("likeCount"),
						};
						localStorage.setItem(
							LOCALSTORAGE.prefix_cached_palettes,
							JSON.stringify(localData)
						);
					}
				}
			})
			.catch((err) => {
				console.log("getPalette catch", err);
			});
	};

	if (shouldUpdate > 0) {
		likePalette();
		handleInteraction("palette_liked", { paletteId });
	} else if (shouldUpdate < 0) {
		dislikePalette();
		handleInteraction("palette_disliked", { paletteId });
	} else {
		getPalette(paletteId);
	}

	return palette;
};

export default handlePaletteLike;
