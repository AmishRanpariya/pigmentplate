import React, { useEffect, useState } from "react";
import { useTransform, useViewportScroll } from "framer-motion";
import { db } from "../../firebase/config";

import Palette from "../PaletteContainer/Palette/Palette";
import "./Home.css";
import { LOCALSTORAGE, PAGINATE, PALETTE_COLLECTION } from "../../Const";

//for App.js
const Home = ({ userId }) => {
	const [lastDoc, setLastDoc] = useState(null); //lastDoc ref for pagination on firestore
	const [isReachedEnd, setIsReachedEnd] = useState(false); //if last palette reached then no more request

	const [isScrollComplete, setIsScrollComplete] = useState(false); //isSrolled to end,if so , reuest more palettes
	const { scrollYProgress } = useViewportScroll(); //motion hook to get scroll position
	const yRange = useTransform(scrollYProgress, [0, 0.9], [0, 1]); //motion hook for Y value

	useEffect(() => {
		yRange.onChange((v) => setIsScrollComplete(v >= 1)); //check if Scrolled to end, then set isScrollCompleted
	}, [yRange]);

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

	const getMoreData = () => {
		//checks Before fetching next batch
		if (!isReachedEnd) {
			getNextPalettePage(setPalettes);
		}
	};

	useEffect(() => {
		if (isScrollComplete) {
			getMoreData(); //call fore next palettes
		}
	}, [isScrollComplete]);

	return (
		<>
			<div className="wrapper">
				{palettes && palettes.length > 0
					? palettes.map((palette) => (
							<Palette
								key={"HomePalette" + palette.id}
								userId={userId}
								palette={palette}
							/>
					  ))
					: null}
			</div>
		</>
	);
};

export default Home;
