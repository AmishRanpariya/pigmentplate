import React from "react";

import "./Tag.css";
const Tag = ({ id, text, handleClick, active }) => {
	return (
		<div
			tabIndex="0"
			className={active ? "btn roundedTag activeTag" : "btn roundedTag "}
			onClick={(e) => {
				handleClick(e);
			}}
			onKeyDown={(e) => {
				if (e.key === " ") {
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
