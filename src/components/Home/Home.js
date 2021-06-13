import React, { useEffect, useRef } from "react";

import Palette from "../PaletteContainer/Palette/Palette";
import SkeletonPalette from "../PaletteContainer/Palette/SkeletonPalette";
import usePagination from "../../hooks/usePagination";
import handleInteraction from "../../funtions/handleInteraction";
import { LOCALSTORAGE } from "../../Const";

//for App.js
const Home = () => {
	const { palettes } = usePagination();

	const likedPalettes = useRef(
		JSON.parse(localStorage.getItem(LOCALSTORAGE.prefix_cached_user))
			.likedPalette
	);

	useEffect(() => {
		document.title = "Home | Pigment Plate";
		handleInteraction("home_open");
		//scrolling to top for every home page visit
		let bodyEle = document.querySelector("#root").offsetTop;
		document.querySelector(".container").scrollTop = bodyEle - 61.2;
	}, []);

	return (
		<div className="wrapper">
			{palettes && palettes.length > 0
				? palettes.map((palette) => (
						<Palette
							key={palette.id}
							palette={palette}
							isLiked={likedPalettes.current.includes(palette.id)}
						/>
				  ))
				: [
						<SkeletonPalette key="1" />,
						<SkeletonPalette key="2" />,
						<SkeletonPalette key="3" />,
						<SkeletonPalette key="4" />,
						<SkeletonPalette key="5" />,
						<SkeletonPalette key="6" />,
						<SkeletonPalette key="7" />,
						<SkeletonPalette key="8" />,
						<SkeletonPalette key="9" />,
						<SkeletonPalette key="10" />,
				  ]}
		</div>
	);
};
export default Home;
