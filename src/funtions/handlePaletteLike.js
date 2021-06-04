import { PALETTE_COLLECTION, USER_COLLECTION } from "../Const";
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
				console.log("palette liked");
				return db
					.collection(PALETTE_COLLECTION.collection_name)
					.doc(paletteId)
					.get();
			})
			.then((snap) => {
				callback(snap.data());
				palette = snap.data();
			})
			.catch((err) => {
				console.log(err);
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
				console.log("palette disliked");
				return db
					.collection(PALETTE_COLLECTION.collection_name)
					.doc(paletteId)
					.get();
			})
			.then((snap) => {
				callback(snap.data());
				palette = snap.data();
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const getPalette = (paletteId) => {
		return db
			.collection(PALETTE_COLLECTION.collection_name)
			.doc(paletteId)
			.get()
			.then((snap) => {
				console.log("palette fetched");
				if (snap && snap.exists) {
					callback(snap.data());
					palette = snap.data();
					console.log(palette);
				}
			})
			.catch((err) => {
				console.log(err);
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
