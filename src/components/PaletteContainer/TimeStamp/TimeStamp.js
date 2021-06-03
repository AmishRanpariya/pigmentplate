import React from "react";
import { formatDistanceToNow } from "date-fns";

//for
//DetailedPalette.js
//Palette.js

const TimeStamp = ({ timestamp }) => {
	return <div className="time">{formatDistanceToNow(new Date(timestamp))}</div>;
};
export default TimeStamp;
