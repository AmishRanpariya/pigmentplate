import React, { memo } from "react";
import { handleCopyToClipBoard } from "../../../../funtions/handleCopyToClipBoard";

import "./CopyHex.css";

//for
//LikedPalette.js
//Palette.js
const CopyHex = memo(({ color, paletteId }) => {
	return (
		<span className="copy" onClick={(e) => handleCopyToClipBoard(e, paletteId)}>
			{"#" + color.toUpperCase()}
		</span>
	);
});

export default CopyHex;
