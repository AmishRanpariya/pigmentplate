import React from "react";

import "./Palette.css";
import { DEFAULT_PALETTE } from "../../../Const";
import LikeButton from "./LikeButton/LikeButton";

//for Home.js
const SkeletonPalette = () => {
	return (
		<div className="Palette">
			<div className="color-grid">
				<div
					className="color"
					style={{ backgroundColor: "#" + DEFAULT_PALETTE.colors[0] }}
				></div>
				<div
					className="color"
					style={{ backgroundColor: "#" + DEFAULT_PALETTE.colors[1] }}
				></div>
				<div
					className="color"
					style={{ backgroundColor: "#" + DEFAULT_PALETTE.colors[2] }}
				></div>
				<div
					className="color"
					style={{ backgroundColor: "#" + DEFAULT_PALETTE.colors[3] }}
				></div>
			</div>
			<div className="metadata">
				<LikeButton />
				<div classes="timestamp" />
			</div>
		</div>
	);
};

export default SkeletonPalette;
