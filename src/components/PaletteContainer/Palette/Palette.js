import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import CopyHex from "./CopyHex/CopyHex";
import LikeButton from "./LikeButton/LikeButton";
import TimeStamp from "../../UI/TimeStamp/TimeStamp";
import "./Palette.css";
import useUpdatePaletteLike from "../../../hooks/useUpdatePaletteLike";
import { LOCALSTORAGE } from "../../../Const";

//for Home.js
const Palette = ({ palette, userId }) => {
	const params = useParams();

	const [Palette, setPalette] = useState(palette);

	const [isLiked, setIsLiked] = useState(
		localStorage.getItem(LOCALSTORAGE.prefix_liked + Palette.id) > 0
	);
	const [shouldUpdateLike, setShouldUpdateLike] = useState(0); //0 means dont do anything
	useUpdatePaletteLike(userId, shouldUpdateLike, Palette.id, setPalette);

	useEffect(() => {
		setPalette(palette);
	}, [palette]);

	const LikeButtonClickHandler = (e) => {
		e.preventDefault();
		if (isLiked) {
			localStorage.removeItem(LOCALSTORAGE.prefix_liked + Palette.id);
			setIsLiked(false);
			setShouldUpdateLike(-1); //dislike
			setTimeout(() => {
				setShouldUpdateLike(0);
			}, 1000);
		} else {
			localStorage.setItem(
				LOCALSTORAGE.prefix_liked + Palette.id,
				new Date().getTime()
			);
			setIsLiked(true);
			setShouldUpdateLike(1); //like
			setTimeout(() => {
				setShouldUpdateLike(0);
			}, 1000);
		}
	};
	if (params && params.id && params.id === palette.id) {
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
					isLiked={isLiked}
					likeCount={Palette.likeCount}
					onclicked={LikeButtonClickHandler}
				/>
				<TimeStamp classes="timestamp" timestamp={Palette.createdAt} />
				<div className="styling">{Palette.likeCount}</div>
			</div>
		</Link>
	);
};

export default Palette;
