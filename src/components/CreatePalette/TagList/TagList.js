import React from "react";
import Tag from "./Tag";

const TagList = ({ tagList, handleClick }) => {
	return (
		tagList &&
		tagList.map((tag, ind) => (
			<Tag
				key={tag.text + ind}
				text={tag.text}
				id={ind}
				handleClick={handleClick}
				active={tag.isActive}
			/>
		))
	);
};

export default TagList;
