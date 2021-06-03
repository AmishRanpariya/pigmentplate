import React, { useState } from "react";
import { motion } from "framer-motion";
import { Redirect, useParams } from "react-router";

import usePaletteListener from "../../../firebase/usePaletteListener";
import useUpdatePaletteLike from "../../../firebase/useUpdatePaletteLike";
import TimeStamp from "../TimeStamp/TimeStamp";
import BigLikeButton from "./BigLikeButton/BigLikeButton";
import "./DetailedPalette.css";

//animation
const container = {
	hidden: { scale: 0, y: "20vh" },
	visible: {
		scale: 1,
		y: 0,
		transition: { delayChildren: 0.1, staggerChildren: 0.1 },
	},
};
//animation
const item = {
	hidden: { y: "-80vh", opacity: 0 },
	visible: { y: 0, opacity: 1 },
};

//for App.js
const DetailedPalette = ({ userId }) => {
	const params = useParams();
	const { palette, isPending, error } = usePaletteListener(params.id);

	const [isLiked, setIsLiked] = useState(
		localStorage.getItem("PigmentPlateLiked/" + params.id) > 0
	);
	const [shouldUpdateLike, setShouldUpdateLike] = useState(0); //means dont do anything
	useUpdatePaletteLike(userId, shouldUpdateLike, params.id);

	const LikeButtonClickHandler = (e) => {
		console.log("called");
		e.preventDefault();
		if (isLiked) {
			localStorage.removeItem("PigmentPlateLiked/" + params.id);
			setIsLiked(false);
			setShouldUpdateLike(-1); //dislike
			setTimeout(() => {
				setShouldUpdateLike(0);
			}, 1000);
		} else {
			localStorage.setItem(
				"PigmentPlateLiked/" + params.id,
				new Date().getTime()
			);
			setIsLiked(true);
			setShouldUpdateLike(1); //like
			setTimeout(() => {
				setShouldUpdateLike(0);
			}, 1000);
		}
	};

	return (
		<>
			{isPending && <div>Loading Detailed Palette...</div>}
			{error && <Redirect to="/" />}
			{palette && (
				<motion.div
					className="DetailedPalette"
					variants={container}
					initial="hidden"
					animate="visible"
				>
					<div className="color-grid">
						{palette.colors.map((color, index) => (
							<motion.div
								key={"color" + index}
								className="color"
								style={{ backgroundColor: "#" + color }}
								variants={item}
							>
								<span>{"#" + color.toUpperCase()}</span>
							</motion.div>
						))}
					</div>

					<BigLikeButton isLiked={isLiked} onclicked={LikeButtonClickHandler} />

					<div className="metadata">
						<div className="tags">
							{palette.tags.map((tag, index) => (
								<a key={index} href={"#" + tag}>
									#{tag}
								</a>
							))}
						</div>
						<TimeStamp timestamp={palette.createdAt} />
						<div className="styleing">{palette.likeCount}</div>
					</div>
				</motion.div>
			)}
		</>
	);
};

export default DetailedPalette;
