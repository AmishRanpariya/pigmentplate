import React, { useEffect, useRef } from "react";

import Palette from "../PaletteContainer/Palette/Palette";
import SkeletonPalette from "../PaletteContainer/Palette/SkeletonPalette";
import useSortedPagination from "../../hooks/useSortedPagination";
import handleInteraction from "../../funtions/handleInteraction";
import { LOCALSTORAGE } from "../../Const";

//for App.js
const SortedPalettes = ({ orderby, isAsc }) => {
	const { palettes } = useSortedPagination(orderby, isAsc);
	useEffect(() => {
		document.title = "Popular Palettes | Pigment Plate";
		handleInteraction("popular_palette_open", { orderby });
	}, [orderby]);

	const likedPalettes = useRef(
		JSON.parse(localStorage.getItem(LOCALSTORAGE.prefix_cached_user))
			.likedPalette
	);

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
export default SortedPalettes;
