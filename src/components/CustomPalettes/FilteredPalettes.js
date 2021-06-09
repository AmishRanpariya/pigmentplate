import React, { useEffect } from "react";

import Palette from "../PaletteContainer/Palette/Palette";
import SkeletonPalette from "../PaletteContainer/Palette/SkeletonPalette";
import useFilteredPagination from "../../hooks/useFilteredPagination";
import { useParams } from "react-router";
import handleInteraction from "../../funtions/handleInteraction";

//for App.js
const FilteredPalettes = () => {
	const params = useParams();
	const { palettes } = useFilteredPagination(params.tagname);
	useEffect(() => {
		document.title = "Similar Palettes | Pigment Plate";
		handleInteraction("filtered_palettes_open", {
			forColor: params.tagname,
		});
	}, [params]);

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
export default FilteredPalettes;
