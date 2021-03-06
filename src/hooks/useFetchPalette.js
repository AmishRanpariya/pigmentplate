import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { db } from "../firebase/config";

import { PALETTE_COLLECTION } from "../Const";
import handleInteraction from "../funtions/handleInteraction";

//for DetailedPalette.js
const useFetchPalette = (paletteId) => {
	const [palette, setPalette] = useState(null);
	const [error, setError] = useState(null);
	const history = useHistory();

	useEffect(() => {
		let mounted = true;
		db.collection(PALETTE_COLLECTION.collection_name)
			.doc(paletteId)
			.get()
			.then((doc) => {
				if (doc && doc.exists) {
					// console.log("db used for palette fetched at useFetchPalette");
					mounted && setPalette(doc.data());
					handleInteraction("fetched_palette", { paletteId });
					mounted && setError(null);
				} else {
					// console.log("palette not exit");
					history.push("/"); //redirect to home page if doesn't exist
				}
			})
			.catch((err) => {
				console.log("useFetchPalette catch", err);
				handleInteraction("err_fetching_palette", { err: err.message });
				mounted && setError(err.message);
			});
		return () => {
			mounted = false;
		};
	}, [paletteId, history]);

	return { palette, error, setPalette };
};

export default useFetchPalette;
