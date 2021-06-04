// import { useEffect, useRef, useState } from "react";
// import { LOCALSTORAGE, PALETTE_COLLECTION, USER_COLLECTION } from "../Const";
// import { db, firebase } from "../firebase/config";

// //for
// //DetailedPalette.js
// //Palette.js
// const useUpdatePaletteLike = (
// 	userId,
// 	shouldUpdate,
// 	paletteId,
// 	callback = () => {}
// ) => {
// 	// const [isPending, setIsPending] = useState(true);
// 	// const [error, setError] = useState(null);

// 	useEffect(() => {
// 		const likePalette = () => {
// 			// Get a new write batch
// 			let batch = db.batch();

// 			let userRef = db.collection(USER_COLLECTION.collection_name).doc(userId);
// 			batch.update(userRef, {
// 				interactionCount: firebase.firestore.FieldValue.increment(1),
// 				likedPalette: firebase.firestore.FieldValue.arrayUnion(paletteId),
// 			});

// 			let paletteRef = db
// 				.collection(PALETTE_COLLECTION.collection_name)
// 				.doc(paletteId);
// 			batch.update(paletteRef, {
// 				interactionCount: firebase.firestore.FieldValue.increment(1),
// 				likedBy: firebase.firestore.FieldValue.arrayUnion(userId),
// 				likeCount: firebase.firestore.FieldValue.increment(1),
// 			});

// 			// Commit the batch
// 			batch
// 				.commit()
// 				.then(() => {
// 					console.log("palette liked");
// 					return db
// 						.collection(PALETTE_COLLECTION.collection_name)
// 						.doc(paletteId)
// 						.get();
// 				})
// 				.then((snap) => {
// 					callback(snap.data());
// 					// error && setError(null);
// 					// setIsPending(false);
// 				})
// 				.catch((err) => {
// 					console.log(err);
// 					// setError(err.message);
// 					// setIsPending(false);
// 				});
// 		};

// 		const dislikePalette = () => {
// 			// Get a new write batch
// 			let batch = db.batch();

// 			let userRef = db.collection(USER_COLLECTION.collection_name).doc(userId);
// 			batch.update(userRef, {
// 				interactionCount: firebase.firestore.FieldValue.increment(1),
// 				likedPalette: firebase.firestore.FieldValue.arrayRemove(paletteId),
// 			});

// 			let paletteRef = db
// 				.collection(PALETTE_COLLECTION.collection_name)
// 				.doc(paletteId);
// 			batch.update(paletteRef, {
// 				interactionCount: firebase.firestore.FieldValue.increment(1),
// 				likedBy: firebase.firestore.FieldValue.arrayRemove(userId),
// 				likeCount: firebase.firestore.FieldValue.increment(-1),
// 			});

// 			// Commit the batch
// 			batch
// 				.commit()
// 				.then(() => {
// 					console.log("palette disliked");
// 					return db
// 						.collection(PALETTE_COLLECTION.collection_name)
// 						.doc(paletteId)
// 						.get();
// 				})
// 				.then((snap) => {
// 					callback(snap.data());
// 					console.log("likeUpdate due to this");
// 					// error && setError(null);
// 					// setIsPending(false);
// 				})
// 				.catch((err) => {
// 					console.log(err);
// 					// setError(err.message);
// 					// setIsPending(false);
// 				});
// 		};

// 		if (shouldUpdate > 0) {
// 			likePalette();
// 			localStorage.setItem(
// 				LOCALSTORAGE.prefix_interaction,
// 				+localStorage.getItem(LOCALSTORAGE.prefix_interaction) + 1
// 			);
// 		} else if (shouldUpdate < 0) {
// 			dislikePalette();
// 			localStorage.setItem(
// 				LOCALSTORAGE.prefix_interaction,
// 				+localStorage.getItem(LOCALSTORAGE.prefix_interaction) + 1
// 			);
// 		} //else do nothing
// 	}, [shouldUpdate]);

// 	return {};
// };

// export default useUpdatePaletteLike;
