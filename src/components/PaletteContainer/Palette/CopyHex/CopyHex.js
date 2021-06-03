import React from "react";

import "./CopyHex.css";

//for
//LikedPalette.js
//Palette.js
const CopyHex = ({ color }) => {
	const copyToClipBoard = (e) => {
		e.preventDefault();
		//to copy HEXcode on clipboard by clicking this
		let temp = document.createElement("input");
		document.body.appendChild(temp);
		temp.value = e.target.innerText;
		temp.select();
		document.execCommand("copy");
		temp.remove();
	};
	return (
		<span className="copy" onClick={copyToClipBoard}>
			{"#" + color.toUpperCase()}
		</span>
	);
};

export default CopyHex;
