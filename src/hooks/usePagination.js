import { useEffect, useRef, useState } from "react";
import { db, Timestamp } from "../firebase/config";

import { CACHE, LOCALSTORAGE, PAGINATE, PALETTE_COLLECTION } from "../Const";
import handleInteraction from "../funtions/handleInteraction";

const usePagination = () => {
	//for infinite scroll
	const [palettes, setPalettes] = useState([]);
	const [isScrollComplete, setIsScrollComplete] = useState(false); //isScrolled to end,if so , reuest more palettes
	const lastDoc = useRef(null);
	const isReachedEnd = useRef(false);
	const mounted = useRef(true);

	const getLocalPalettes = (callback) => {
		if (localStorage.getItem(LOCALSTORAGE.prefix_cached_palettes_date)) {
			const lastTimestamp = localStorage.getItem(
				LOCALSTORAGE.prefix_cached_palettes_date
			);
			if (
				Date.now() - lastTimestamp < CACHE.maxCacheTime &&
				localStorage.getItem(LOCALSTORAGE.prefix_cached_palettes) &&
				localStorage.getItem(LOCALSTORAGE.prefix_cached_lastDoc)
			) {
				//means cache is fresh
				//means fresh cache is there
				const data = JSON.parse(
					localStorage.getItem(LOCALSTORAGE.prefix_cached_palettes)
				);
				console.log("cache data used");
				mounted.current && callback(data);
				lastDoc.current = JSON.parse(
					localStorage.getItem(LOCALSTORAGE.prefix_cached_lastDoc)
				);
				return true;
			} else {
				//means cache is old
				//or cache in not there (deleted by user or something)
				//so we need to clear cache
				localStorage.removeItem(LOCALSTORAGE.prefix_cached_palettes);
				localStorage.removeItem(LOCALSTORAGE.prefix_cached_lastDoc);
				localStorage.removeItem(LOCALSTORAGE.prefix_cached_palettes_date);
				return false; //returning false so new data will be fetched
			}
		} else {
			return false;
			//no cache date means no cache done previouly
		}
	};

	const setLocalPalettes = (data) => {
		localStorage.setItem(LOCALSTORAGE.prefix_cached_palettes_date, Date.now()); //store caching time

		if (localStorage.getItem(LOCALSTORAGE.prefix_cached_palettes)) {
			//means some data already stored now append new data to existing data
			const oldData = JSON.parse(
				localStorage.getItem(LOCALSTORAGE.prefix_cached_palettes)
			);

			console.log("data cached");
			localStorage.setItem(
				LOCALSTORAGE.prefix_cached_palettes,
				JSON.stringify(oldData.concat(data))
			);
		} else {
			//no old data there so only store new data
			localStorage.setItem(
				LOCALSTORAGE.prefix_cached_palettes,
				JSON.stringify(data)
			);
		}

		localStorage.setItem(
			LOCALSTORAGE.prefix_cached_lastDoc,
			JSON.stringify(lastDoc.current)
		);
	};

	const getNextPalettePage = async (callback, localCallback) => {
		let newPalettes = [];
		let snap;
		if (!lastDoc.current) {
			//first query
			snap = await db
				.collection(PALETTE_COLLECTION.collection_name)
				.where("status", "==", "public")
				.orderBy(PALETTE_COLLECTION.timeField, "desc")
				.limit(PAGINATE.initialFetchCount)
				.get();
		} else {
			//next queries
			snap = await db
				.collection(PALETTE_COLLECTION.collection_name)
				.where("status", "==", "public")
				.orderBy(PALETTE_COLLECTION.timeField, "desc")
				.startAfter(
					new Timestamp(lastDoc.current.seconds, lastDoc.current.nanoseconds)
				)
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
			lastDoc.current = snap.docs[snap.docs.length - 1].get("createdAt"); //saving last reference for next query
			mounted.current &&
				callback((_palettes) => {
					return _palettes.concat(newPalettes);
				});
			localCallback(newPalettes);

			if (
				snap.docs.length !== PAGINATE.initialFetchCount &&
				snap.docs.length !== PAGINATE.subSequentFetchCount
			) {
				//means last batch brought less data. means we reached end in db
				isReachedEnd.current = true;
				handleInteraction("reached_to_bottom", { scrolledFor: "home" });
			}
		} else {
			//reached end
			isReachedEnd.current = true;
			handleInteraction("reached_to_bottom", { scrolledFor: "home" });
			// throw new Error("no snaps");
		}
		return newPalettes;
	};

	useEffect(() => {
		mounted.current = true;
		if (!getLocalPalettes(setPalettes)) {
			getNextPalettePage(setPalettes, setLocalPalettes); //call for initial page
		}

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
				getNextPalettePage(setPalettes, setLocalPalettes); //call fore next palettes
			}
		}
		return () => {
			mounted.current = false;
		};
	}, [isScrollComplete]);
	return { palettes };
};

export default usePagination;
