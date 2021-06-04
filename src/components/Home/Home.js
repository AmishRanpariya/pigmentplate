import React, { useEffect, useState } from "react";
import { db } from "../../firebase/config";

import Palette from "../PaletteContainer/Palette/Palette";
import "./Home.css";
import { LOCALSTORAGE, PAGINATE, PALETTE_COLLECTION } from "../../Const";

//for App.js
const Home = () => {
	//for infinite scroll
	const [lastDoc, setLastDoc] = useState(null); //lastDoc ref for pagination on firestore
	const [isReachedEnd, setIsReachedEnd] = useState(false); //if last palette reached then no more request
	const [isScrollComplete, setIsScrollComplete] = useState(false); //isScrolled to end,if so , reuest more palettes
	useEffect(() => {
		if (document.querySelector(".wrapper")) {
			const wrapper = document.querySelector(".wrapper");
			const handleScroll = (e) => {
				if (!isReachedEnd) {
					if (
						wrapper.scrollHeight <=
						wrapper.scrollTop + wrapper.offsetHeight + 30
					) {
						setIsScrollComplete(true);
					} else {
						setIsScrollComplete(false);
					}
				}
			};
			wrapper.addEventListener("scroll", handleScroll);
		}
	}, []);

	const getNextPalettePage = async (callback) => {
		let newPalettes = [];
		let snap;
		if (!lastDoc) {
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
				.startAfter(lastDoc)
				.limit(PAGINATE.subSequentFetchCount)
				.get();
		}
		if (snap && !snap.empty) {
			snap.docs.forEach((doc) => {
				newPalettes.push(doc.data());
			});
			setLastDoc(snap.docs[snap.docs.length - 1]); //saving last reference for next query
			localStorage.setItem(
				LOCALSTORAGE.prefix_interaction,
				+localStorage.getItem(LOCALSTORAGE.prefix_interaction) + 1
			);
			callback((palettes) => {
				return palettes.concat(newPalettes);
			});
		} else {
			//reached end
			localStorage.setItem(
				LOCALSTORAGE.prefix_interaction,
				+localStorage.getItem(LOCALSTORAGE.prefix_interaction) + 1
			);
			setIsReachedEnd(true);

			// throw new Error("no snaps");
		}
		return newPalettes;
	};

	const [palettes, setPalettes] = useState([]);
	useEffect(() => {
		getNextPalettePage(setPalettes); //call for initial page
	}, []);

	useEffect(() => {
		if (isScrollComplete) {
			if (!isReachedEnd) {
				getNextPalettePage(setPalettes); //call fore next palettes
			}
		}
	}, [isScrollComplete]);

	return (
		<div className="wrapper">
			{palettes && palettes.length > 0
				? palettes.map((palette) => (
						<Palette key={palette.id} palette={palette} />
				  ))
				: null}
		</div>
	);
};

export default Home;
