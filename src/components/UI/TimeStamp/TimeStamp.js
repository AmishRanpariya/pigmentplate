import React, { memo } from "react";
import { formatDistanceToNow } from "date-fns";

//for
//DetailedPalette.js
//Palette.js

const TimeStamp = memo(({ timestamp, classes }) => {
	return timestamp && timestamp.seconds ? (
		<div className={classes}>
			{formatDistanceToNow(timestamp.seconds * 1000)}
		</div>
	) : (
		<div className={classes}>{formatDistanceToNow(timestamp)}</div>
	);
});

export default TimeStamp;
