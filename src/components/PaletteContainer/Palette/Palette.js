import React, { memo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import CopyHex from "./CopyHex/CopyHex";
import LikeButton from "./LikeButton/LikeButton";
import TimeStamp from "../../UI/TimeStamp/TimeStamp";
import "./Palette.css";
import { LOCALSTORAGE } from "../../../Const";
import handlePaletteLike from "../../../funtions/handlePaletteLike";

//for Home.js
const Palette = memo((props) => {
	const params = useParams();
	const userId = localStorage.getItem(LOCALSTORAGE.prefix_userId);

	const [Palette, setPalette] = useState(props.palette);

	const isLiked = useRef(
		localStorage.getItem(LOCALSTORAGE.prefix_liked + Palette.id) > 0
	);

	const LikeButtonClickHandler = (e) => {
		e.preventDefault();
		if (isLiked.current === true) {
			isLiked.current = false;
			handlePaletteLike(Palette.id, userId, -1, setPalette);
			localStorage.removeItem(LOCALSTORAGE.prefix_liked + Palette.id);
		} else {
			isLiked.current = true;
			handlePaletteLike(Palette.id, userId, 1, setPalette);
			localStorage.setItem(LOCALSTORAGE.prefix_liked + Palette.id, Date.now());
		}
	};

	if (params && params.id && params.id === props.palette.id) {
		return null; //dont show this palette if Detailed palette is showing this palette there
	}
	return (
		<Link className="Palette" to={"/palette/" + Palette.id}>
			<motion.div
				className="color-grid"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
			>
				{Palette.colors.map((color, index) => (
					<div
						key={index}
						className="color"
						style={{ backgroundColor: "#" + color }}
					>
						<CopyHex color={color} />
					</div>
				))}
			</motion.div>
			<div className="metadata">
				<LikeButton
					isLiked={isLiked.current === true}
					likeCount={Palette.likeCount}
					onclicked={LikeButtonClickHandler}
				/>
				<TimeStamp classes="timestamp" timestamp={Palette.createdAt} />
				<div className="styling">{Palette.likeCount}</div>
			</div>
		</Link>
	);
});

export default Palette;
