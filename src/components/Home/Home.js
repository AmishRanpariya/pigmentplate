import React, { useEffect } from "react";

import Palette from "../PaletteContainer/Palette/Palette";
import SkeletonPalette from "../PaletteContainer/Palette/SkeletonPalette";
import usePagination from "../../hooks/usePagination";

//for App.js
const Home = () => {
	const { palettes } = usePagination();
	useEffect(() => {
		//scrolling to top for every home page visit
		let bodyEle = document.querySelector("#root").offsetTop;
		document.querySelector(".container").scrollTop = bodyEle - 61.2;
	}, []);
	return (
		<div className="wrapper">
			{palettes && palettes.length > 0
				? palettes.map((palette) => (
						<Palette key={palette.id} palette={palette} />
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
