import { useEffect, useRef, useState } from "react";
import { db } from "../firebase/config";

import { PAGINATE, PALETTE_COLLECTION } from "../Const";
import handleInteraction from "../funtions/handleInteraction";

const useSortedPagination = (orderby, isAsc) => {
	//for infinite scroll
	const [palettes, setPalettes] = useState([]);
	const [isScrollComplete, setIsScrollComplete] = useState(false); //isScrolled to end,if so , reuest more palettes
	const lastDoc = useRef(null);
	const isReachedEnd = useRef(false);
	const mounted = useRef(true);

	const orderByfield = useRef(orderby);
	const direction = useRef(isAsc ? "asc" : "desc");

	const getNextPalettePage = async (callback) => {
		handleInteraction();
		let newPalettes = [];
		let snap;
		if (!lastDoc.current) {
			//first query
			snap = await db
				.collection(PALETTE_COLLECTION.collection_name)
				.orderBy(orderByfield.current, direction.current)
				.limit(PAGINATE.initialFetchCount)
				.get();
		} else {
			//next queries
			snap = await db
				.collection(PALETTE_COLLECTION.collection_name)
				.orderBy(orderByfield.current, direction.current)
				.startAfter(lastDoc.current)
				.limit(PAGINATE.subSequentFetchCount)
				.get();
		}

		console.log("db used for page fetch");
		if (snap && !snap.empty) {
			snap.docs.forEach((doc) => {
				newPalettes.push({
					id: doc.get("id"),
					colors: doc.get("colors"),
					createdAt: doc.get("createdAt"),
					likeCount: doc.get("likeCount"),
				});
			});

			lastDoc.current = snap.docs[snap.docs.length - 1]; //saving last reference for next query

			mounted.current &&
				callback((_palettes) => {
					return _palettes.concat(newPalettes);
				});

			if (
				snap.docs.length !== PAGINATE.initialFetchCount &&
				snap.docs.length !== PAGINATE.subSequentFetchCount
			) {
				//means last batch brought less data. means we reached end in db
				isReachedEnd.current = true;
			}
		} else {
			//reached end
			isReachedEnd.current = true;
			// throw new Error("no snaps");
		}
		return newPalettes;
	};

	useEffect(() => {
		mounted.current = true;

		getNextPalettePage(setPalettes); //call for initial page

		const container = document.querySelector(".container");
		const handleScroll = (e) => {
			if (!isReachedEnd.current) {
				mounted.current &&
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
			mounted.current = false;
		};
	}, []);

	useEffect(() => {
		mounted.current = true;

		if (isScrollComplete) {
			if (!isReachedEnd.current) {
				getNextPalettePage(setPalettes); //call fore next palettes
			}
		}
		return () => {
			mounted.current = false;
		};
	}, [isScrollComplete]);
	return { palettes };
};

export default useSortedPagination;
