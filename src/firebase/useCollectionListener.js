import { useEffect, useState } from "react";
import { PALETTE_COLLECTION } from "../Const";
import { db } from "./config";

//for none
const useCollectionListener = (collection) => {
	const [docs, setDocs] = useState([]);
	useEffect(() => {
		const unsub = db
			.collection(collection)
			.orderBy(PALETTE_COLLECTION.timeField, "desc")
			.onSnapshot((snap) => {
				let documents = [];
				snap.forEach((doc) => {
					documents.push({ ...doc.data() });
				});
				setDocs([...documents]);
			});
		return () => unsub();
	}, [collection]);

	return { docs };
};
export default useCollectionListener;
