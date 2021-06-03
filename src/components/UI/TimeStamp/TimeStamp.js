import React from "react";
import { formatDistanceToNow } from "date-fns";

//for
//DetailedPalette.js
//Palette.js

const TimeStamp = ({ timestamp, classes }) => {
	return (
		<div className={classes}>{formatDistanceToNow(new Date(timestamp))}</div>
	);
};
export default TimeStamp;
