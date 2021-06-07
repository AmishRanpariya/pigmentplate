import { LOCALSTORAGE, PALETTE_COLLECTION, USER_COLLECTION } from "../Const";
import { db, firebase } from "../firebase/config";
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
		});

		let paletteRef = db
			.collection(PALETTE_COLLECTION.collection_name)
			.doc(paletteId);
		batch.update(paletteRef, {
			interactionCount: firebase.firestore.FieldValue.increment(1),
			likedBy: firebase.firestore.FieldValue.arrayUnion(userId),
			likeCount: firebase.firestore.FieldValue.increment(1),
		});

		// Commit the batch
		batch
			.commit()
			.then(() => {
				console.log("db used for palette liked");
				getPalette(paletteId);
			})
			.catch((err) => {
				console.log(err);
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
		});

		let paletteRef = db
			.collection(PALETTE_COLLECTION.collection_name)
			.doc(paletteId);
		batch.update(paletteRef, {
			interactionCount: firebase.firestore.FieldValue.increment(1),
			likedBy: firebase.firestore.FieldValue.arrayRemove(userId),
			likeCount: firebase.firestore.FieldValue.increment(-1),
		});

		// Commit the batch
		batch
			.commit()
			.then(() => {
				console.log("db used for palette unliked");
				getPalette(paletteId);
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
				console.log("db used for fetching palette");
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

	handleInteraction();
	if (shouldUpdate > 0) {
		likePalette();
	} else if (shouldUpdate < 0) {
		dislikePalette();
	} else {
		getPalette(paletteId);
	}

	return palette;
};

export default handlePaletteLike;
