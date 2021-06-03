import React from "react";
import { handleCopyToClipBoard } from "../../../../funtions/handleCopyToClipBoard";

import "./CopyHex.css";

//for
//LikedPalette.js
//Palette.js
const CopyHex = ({ color }) => {
	return (
		<span className="copy" onClick={handleCopyToClipBoard}>
			{"#" + color.toUpperCase()}
		</span>
	);
};

export default CopyHex;
