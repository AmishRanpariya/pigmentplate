import React, { memo } from "react";
import { handleCopyToClipBoard } from "../../../../funtions/handleCopyToClipBoard";

import "./CopyHex.css";

//for
//LikedPalette.js
//Palette.js
const CopyHex = memo(({ color }) => {
	// console.log("CopyHex rendered");

	return (
		<span className="copy" onClick={handleCopyToClipBoard}>
			{"#" + color.toUpperCase()}
		</span>
	);
});

export default CopyHex;
