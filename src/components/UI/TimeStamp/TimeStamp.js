import React, { memo } from "react";
import { formatDistanceToNow } from "date-fns";

//for
//DetailedPalette.js
//Palette.js

const TimeStamp = memo(({ timestamp, classes }) => {
	return (
		<div className={classes}>{formatDistanceToNow(new Date(timestamp))}</div>
	);
});

export default TimeStamp;
