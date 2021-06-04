import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Redirect, useHistory, useParams } from "react-router";
import * as htmlToImage from "html-to-image";

// import usePaletteListener from "../../../hooks/usePaletteListener";
// import useUpdatePaletteLike from "../../../hooks/useUpdatePaletteLike";
import TimeStamp from "../../UI/TimeStamp/TimeStamp";
import BigLikeButton from "./BigLikeButton/BigLikeButton";
import "./DetailedPalette.css";
import { BASEURL, LOCALSTORAGE } from "../../../Const";
import { handleCopyToClipBoard } from "../../../funtions/handleCopyToClipBoard";
import "./downloadPaletteStyle.css";
import handlePaletteLike from "../../../funtions/handlePaletteLike";
import useFetchPalette from "../../../hooks/useFetchPalette";
//animation
const container = {
	hidden: { scale: 0, y: "20vh" },
	visible: {
		scale: 1,
		y: 0,
		transition: { delayChildren: 0, staggerChildren: 0.1 },
	},
};
//animation
const item = {
	hidden: { y: "-80vh", opacity: 0 },
	visible: { y: 0, opacity: 1 },
};
//for App.js
const DetailedPalette = () => {
	console.log("DetailedPalette rendered");
	const params = useParams();
	const { palette, error, setPalette } = useFetchPalette(params.id);
	// const [palette, setPalette] = useState(() => handlePaletteLike(params.id));
	const userId = localStorage.getItem(LOCALSTORAGE.prefix_userId);
	console.log(palette);
	const isLiked = useRef(
		localStorage.getItem(LOCALSTORAGE.prefix_liked + params.id) > 0
	);

	const LikeButtonClickHandler = (e) => {
		e.preventDefault();
		if (isLiked.current == true) {
			isLiked.current = false;
			handlePaletteLike(params.id, userId, -1, setPalette);
			localStorage.removeItem(LOCALSTORAGE.prefix_liked + params.id);
		} else {
			isLiked.current = true;
			handlePaletteLike(params.id, userId, 1, setPalette);
			localStorage.setItem(
				LOCALSTORAGE.prefix_liked + params.id,
				new Date().getTime()
			);
		}
	};

	const handlePaletteDownload = (e) => {
		e.preventDefault();
		let paletteHTML = `
			<div class="color-grid">
				<div class="color" style="background-color: ${"#" + palette.colors[0]};">
					<span class="copy">${"#" + palette.colors[0].toUpperCase()}</span>
				</div>
				<div class="color" style="background-color: ${"#" + palette.colors[1]};">
					<span class="copy">${"#" + palette.colors[1].toUpperCase()}</span>
				</div>
				<div class="color" style="background-color: ${"#" + palette.colors[2]};">
					<span class="copy">${"#" + palette.colors[2].toUpperCase()}</span>
				</div>
				<div class="color" style="background-color: ${"#" + palette.colors[3]};">
					<span class="copy">${"#" + palette.colors[3].toUpperCase()}</span>
				</div>
			</div>
			<div class="metadata">
				<span><strong>PIGMENTPLATE</strong></span>
				<span>${BASEURL}/palettes/${palette.id}</span>
				<span class="styling">${palette.likeCount}</span>
			</div>
		`;
		const paletteRef = document.createElement("div");
		paletteRef.classList.add("downloadPaletteStyle");
		paletteRef.innerHTML = paletteHTML;
		document.body.appendChild(paletteRef);

		htmlToImage
			.toPng(document.querySelector(".downloadPaletteStyle"))
			.then((dataUrl) => {
				var link = document.createElement("a");
				link.download = `PigmentPlate_${palette.id}.png`;
				link.href = dataUrl;
				link.click();
			});
		setTimeout(() => {
			if (document.body.lastChild.classList.contains("downloadPaletteStyle")) {
				document.body.lastChild.remove();
			}
		}, 3000);
	};

	return (
		<>
			{error && <Redirect to="/" />}
			{!palette && <div>Loading Detailed Palette...</div>}
			{palette && palette.colors && (
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
								onClick={handleCopyToClipBoard}
							>
								<span>{"#" + color.toUpperCase()}</span>
							</motion.div>
						))}
					</div>

					<BigLikeButton
						isLiked={isLiked.current == true}
						onclicked={LikeButtonClickHandler}
					/>

					<div className="metadata">
						<button onClick={handlePaletteDownload} className="btn">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
								/>
							</svg>
						</button>
						<div className="tags">
							{palette.tags.map((tag, index) => (
								<a key={index} href={"#" + tag}>
									#{tag}
								</a>
							))}
						</div>
						<TimeStamp classes="timestamp" timestamp={palette.createdAt} />
						<div className="styling">{palette.likeCount}</div>
					</div>
				</motion.div>
			)}
		</>
	);
};

export default DetailedPalette;
