import { useEffect, useRef, useState } from "react";
import { db } from "../firebase/config";
import { PAGINATE, PALETTE_COLLECTION } from "../Const";
import handleInteraction from "../funtions/handleInteraction";

const usePagination = () => {
	//for infinite scroll
	const [palettes, setPalettes] = useState([]);
	const [isScrollComplete, setIsScrollComplete] = useState(false); //isScrolled to end,if so , reuest more palettes
	const lastDoc = useRef(null);
	const isReachedEnd = useRef(false);

	const getNextPalettePage = async (callback) => {
		handleInteraction();
		let newPalettes = [];
		let snap;
		if (!lastDoc.current) {
			//first query
			snap = await db
				.collection(PALETTE_COLLECTION.collection_name)
				.orderBy(PALETTE_COLLECTION.timeField, "desc")
				.limit(PAGINATE.initialFetchCount)
				.get();
		} else {
			//next queries
			snap = await db
				.collection(PALETTE_COLLECTION.collection_name)
				.orderBy(PALETTE_COLLECTION.timeField, "desc")
				.startAfter(lastDoc.current)
				.limit(PAGINATE.subSequentFetchCount)
				.get();
		}
		console.log("db used for page fetch");
		if (snap && !snap.empty) {
			snap.docs.forEach((doc) => {
				newPalettes.push(doc.data());
			});

			lastDoc.current = snap.docs[snap.docs.length - 1]; //saving last reference for next query
			callback((palettes) => {
				return palettes.concat(newPalettes);
			});
		} else {
			//reached end
			isReachedEnd.current = true;
			// throw new Error("no snaps");
		}
		return newPalettes;
	};

	useEffect(() => {
		getNextPalettePage(setPalettes); //call for initial page

		const container = document.querySelector(".container");
		const handleScroll = (e) => {
			if (!isReachedEnd.current) {
				setIsScrollComplete(
					container.scrollHeight <=
						container.scrollTop + container.offsetHeight + 20
				);
			}
		};
		container.addEventListener("scroll", handleScroll);
		// cleanup
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	useEffect(() => {
		if (isScrollComplete) {
			if (!isReachedEnd.current) {
				getNextPalettePage(setPalettes); //call fore next palettes
			}
		}
	}, [isScrollComplete]);
	return { palettes };
};

export default usePagination;
