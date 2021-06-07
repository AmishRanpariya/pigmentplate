import React from "react";
import Tag from "./Tag";

const TagList = ({ taglist, handleClick }) => {
	return (
		taglist &&
		taglist.map((tag, ind) => (
			<Tag key={tag} text={tag} id={ind} handleClick={handleClick} />
		))
	);
};

export default TagList;
