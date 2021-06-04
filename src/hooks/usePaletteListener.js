import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { LOCALSTORAGE, PALETTE_COLLECTION } from "../Const";
import { db } from "../firebase/config";

//for none
const usePaletteListener = (paletteId) => {
	const [palette, setPalette] = useState(null);
	// const [isPending, setIsPending] = useState(true);
	// const [error, setError] = useState(null);
	const history = useHistory();
	useEffect(() => {
		// console.log("useFetchFirestorListener ran for detailed palette");
		const unsub = db
			.collection(PALETTE_COLLECTION.collection_name)
			.doc(paletteId)
			.onSnapshot(
				(doc) => {
					if (doc.exists) {
						// console.log("palette listener", doc.data());
						setPalette(doc.data());
						// localStorage.setItem(
						// 	LOCALSTORAGE.prefix_interaction,
						// 	+localStorage.getItem(LOCALSTORAGE.prefix_interaction) + 1
						// );
						// setIsPending(false);
						// setError(null);
					} else {
						// throw Error("Snapshot not exists");
						// localStorage.setItem(
						// 	LOCALSTORAGE.prefix_interaction,
						// 	+localStorage.getItem(LOCALSTORAGE.prefix_interaction) + 1
						// );
						history.push("/"); //redirect to home page if doesn't exist
					}
				},
				(err) => {
					console.log(err);
					// setError(err.message);
					// setIsPending(false);
				}
			);
		return () => unsub();
	}, [paletteId, history]);

	return { palette, isPending, error };
};

export default usePaletteListener;
