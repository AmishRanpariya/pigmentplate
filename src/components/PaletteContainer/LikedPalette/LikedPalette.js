import React, { useState } from "react";
import { Link } from "react-router-dom";

import CopyHex from "../Palette/CopyHex/CopyHex";
import "./LikedPalette.css";

//for LikedPaletteContainer.js
const LikedPalette = ({ palette }) => {
	const [Palette] = useState(palette);

	return (
		<Link className="LikedPalette" to={"palette/" + Palette.id}>
			<div className="color-grid">
				{Palette.colors.map((color, index) => (
					<div
						key={index}
						className="color"
						style={{ backgroundColor: "#" + color }}
					>
						<CopyHex color={color} />
					</div>
				))}
			</div>
		</Link>
	);
};

export default LikedPalette;
