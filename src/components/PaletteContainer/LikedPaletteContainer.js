import React, { useEffect, useState } from "react";
import { LOCALSTORAGE } from "../../Const";

import LikedPalette from "./LikedPalette/LikedPalette";
import "./LikedPaletteContainer.css";

//for App.js
const LikedPaletteContainer = () => {
	const [favPalettes, setFavPalettes] = useState([]);

	const getLocalPalettes = () => {
		const palettes = [];
		for (let index = 0, len = localStorage.length; index < len; index++) {
			let key = localStorage.key(index);
			if (key.length === 42 && key.indexOf(LOCALSTORAGE.prefix_liked) === 0) {
				let timestamp = localStorage.getItem(key);
				key = key.slice(18, 42);
				const palette = {
					id: key,
					likedAt: +timestamp,
					colors: [
						key.slice(0, 6),
						key.slice(6, 12),
						key.slice(12, 18),
						key.slice(18, 24),
					],
				};
				palettes.push(palette);
			}
		}
		setFavPalettes([...palettes]);
	};

	useEffect(() => {
		getLocalPalettes();
	}, []);

	return (
		<div className="wrapper">
			{!favPalettes && <div>Loading...</div>}
			{favPalettes &&
				favPalettes
					.sort((a, b) => {
						return b.likedAt - a.likedAt;
					})
					.map((palette) => (
						<LikedPalette key={palette.id} palette={palette} />
					))}
		</div>
	);
};

export default LikedPaletteContainer;
