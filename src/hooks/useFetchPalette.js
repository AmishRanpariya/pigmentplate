import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { PALETTE_COLLECTION } from "../Const";
import { db } from "../firebase/config";
import handleInteraction from "../funtions/handleInteraction";

//for DetailedPalette.js
const useFetchPalette = (paletteId) => {
	const [palette, setPalette] = useState(null);
	const [error, setError] = useState(null);
	const history = useHistory();
	useEffect(() => {
		db.collection(PALETTE_COLLECTION.collection_name)
			.doc(paletteId)
			.get()
			.then((doc) => {
				if (doc && doc.exists) {
					console.log("db used for palette fetched at useFetchPalette");
					setPalette(doc.data());
					handleInteraction();
					setError(null);
				} else {
					console.log("palette not exit");
					history.push("/"); //redirect to home page if doesn't exist
				}
			})
			.catch((err) => {
				console.log("useFetchPalette catch", err);
				setError(err.message);
			});
	}, [paletteId, history]);

	return { palette, error, setPalette };
};

export default useFetchPalette;
