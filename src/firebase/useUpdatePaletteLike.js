import { useEffect, useState } from "react";
import { PALETTE_COLLECTION, USER_COLLECTION } from "../Const";
import { db, firebase } from "./config";

//for
//DetailedPalette.js
//Palette.js
const useUpdatePaletteLike = (
	userId,
	shouldUpdate,
	paletteId,
	callback = () => {}
) => {
	const [isPending, setIsPending] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
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
					setError(null);
					setIsPending(false);
				})
				.catch((err) => {
					console.log(err);
					setError(err.message);
					setIsPending(false);
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
					setError(null);
					setIsPending(false);
				})
				.catch((err) => {
					console.log(err);
					setError(err.message);
					setIsPending(false);
				});
		};
		console.log("likeUpdate ran for userId", shouldUpdate);
		if (shouldUpdate > 0) {
			likePalette();
		} else if (shouldUpdate < 0) {
			dislikePalette();
		} //else do nothing
	}, [userId, shouldUpdate, paletteId]);

	return { isPending, error };
};

export default useUpdatePaletteLike;
