create about page

trendy page
popular page
random page

# my palettes page { created + fav }

# tags to be checked if size is not too big

or may be change text input to mutiple option select input

# also make tag hover effect

error handling

admin app/page

# useHistory in detailedpalette crash

# date-fns check for better format

userID randomization

emoji after copy tool tip

import { useEffect, useRef, useState } from "react";
import { db } from "../firebase/config";
import { CACHE, LOCALSTORAGE, PAGINATE, PALETTE_COLLECTION } from "../Const";
import handleInteraction from "../funtions/handleInteraction";

const usePagination = () => {
//for infinite scroll
const [palettes, setPalettes] = useState([]);
const [isScrollComplete, setIsScrollComplete] = useState(false); //isScrolled to end,if so , reuest more palettes
const lastDoc = useRef(null);
const isReachedEnd = useRef(false);

    const getLocalPalettes = (callback) => {
    	if (localStorage.getItem(LOCALSTORAGE.prefix_cached_palettes_date)) {
    		const lastTimestamp = localStorage.getItem(
    			LOCALSTORAGE.prefix_cached_palettes_date
    		);
    		if (lastTimestamp - Date.now() < CACHE.maxCacheTime) {
    			//means cache is fresh
    			if (localStorage.getItem(LOCALSTORAGE.prefix_cached_palettes)) {
    				const data = JSON.parse(
    					localStorage.getItem(LOCALSTORAGE.prefix_cached_palettes)
    				);
    				callback(data);
    				lastDoc.current = JSON.parse(
    					localStorage.getItem(LOCALSTORAGE.prefix_cached_lastDoc)
    				);
    				return true;
    			}
    		} else {
    			// cache is depricated
    			return false;
    		}
    	} else {
    		return false;
    		//no cache date means no cache done previouly
    	}
    };

    const setLocalPalettes = (data) => {
    	localStorage.setItem(LOCALSTORAGE.prefix_cached_palettes_date, Date.now());
    	if (localStorage.getItem(LOCALSTORAGE.prefix_cached_palettes)) {
    		//means some data already stored now append new data to existing data
    		const oldData = JSON.parse(
    			localStorage.getItem(LOCALSTORAGE.prefix_cached_palettes)
    		);

    		oldData.concat(data);
    		localStorage.setItem(
    			LOCALSTORAGE.prefix_cached_palettes,
    			JSON.stringify(oldData)
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
    			newPalettes.push({
    				id: doc.get("id"),
    				colors: doc.get("colors"),
    				createdAt: doc.get("createdAt"),
    				likeCount: doc.get("likeCount"),
    			});
    		});

    		// lastDoc.current = snap.docs[snap.docs.length - 1]; //saving last reference for next query
    		lastDoc.current = snap.docs[snap.docs.length - 1].get("createdAt"); //saving last reference for next query
    		callback((palettes) => {
    			return palettes.concat(newPalettes);
    		});
    		setLocalPalettes(newPalettes);

    		if (
    			snap.docs.length !== PAGINATE.initialFetchCount &&
    			snap.docs.length !== PAGINATE.subSequentFetchCount
    		) {
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
    	if (!getLocalPalettes(setPalettes)) {
    		getNextPalettePage(setPalettes); //call for initial page
    	}

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
