import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { PALETTE_COLLECTION } from "../Const";
import { db } from "./config";

//for DetailedPalette.js
const usePaletteListener = (paletteId) => {
	const [palette, setPalette] = useState(null);
	const [isPending, setIsPending] = useState(true);
	const [error, setError] = useState(null);
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
						setIsPending(false);
						setError(null);
					} else {
						// throw Error("Snapshot not exists");
						history.push("/"); //redirect to home page if doesn't exist
					}
				},
				(err) => {
					console.log(err);
					setError(err.message);
					setIsPending(false);
				}
			);
		return () => unsub();
	}, [paletteId, history]);

	return { palette, isPending, error };
};

export default usePaletteListener;
