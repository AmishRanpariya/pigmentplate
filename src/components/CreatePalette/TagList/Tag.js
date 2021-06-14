import React, { useState } from "react";

import "./Tag.css";
const Tag = ({ id, text, handleClick }) => {
	const [isActive, setIsActive] = useState(false);
	const handelIsActive = () => {
		setIsActive((_isActive) => !_isActive);
	};
	return (
		<div
			tabIndex="0"
			className={isActive ? "btn roundedTag activeTag" : "btn roundedTag "}
			onClick={(e) => {
				handelIsActive();
				handleClick(e);
			}}
			onKeyDown={(e) => {
				if (e.key === " ") {
					handelIsActive();
					handleClick(e);
				}
			}}
			data-id={id}
		>
			{text}
		</div>
	);
};

export default Tag;
