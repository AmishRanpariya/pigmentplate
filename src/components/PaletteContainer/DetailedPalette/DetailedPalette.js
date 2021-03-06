import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Redirect, useParams } from "react-router";
import * as htmlToImage from "html-to-image";

import TimeStamp from "../../UI/TimeStamp/TimeStamp";
import BigLikeButton from "./BigLikeButton/BigLikeButton";
import "./DetailedPalette.css";
import { BASEURL, LOCALSTORAGE } from "../../../Const";
import { handleCopyToClipBoard } from "../../../funtions/handleCopyToClipBoard";
import "./downloadPaletteStyle.css";
import handlePaletteLike from "../../../funtions/handlePaletteLike";
import useFetchPalette from "../../../hooks/useFetchPalette";
import { Link } from "react-router-dom";
import handleInteraction from "../../../funtions/handleInteraction";

//animation
const container = {
	hidden: { y: "20vh" },
	visible: {
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
	const params = useParams();
	const { palette, error, setPalette } = useFetchPalette(params.id);
	const userId = useRef(
		JSON.parse(localStorage.getItem(LOCALSTORAGE.prefix_cached_user)).id
	);
	const isLiked = useRef(
		JSON.parse(
			localStorage.getItem(LOCALSTORAGE.prefix_cached_user)
		).likedPalette.includes(params.id)
	);

	useEffect(() => {
		document.title = "Detailed Palette | Pigment Plate";
		handleInteraction("detailed_palette_open", {
			color: params.id,
		});
		isLiked.current = JSON.parse(
			localStorage.getItem(LOCALSTORAGE.prefix_cached_user)
		).likedPalette.includes(params.id);
	}, [params]);

	useEffect(() => {
		//scrolling to top for every detailed palette
		let bodyEle = document.querySelector("#root").offsetTop;
		if (document.querySelector(".DetailedPalette")) {
			document.querySelector(".container").scrollTop = bodyEle - 61.2;
		}
	}, [params, palette]);

	const LikeButtonClickHandler = (e) => {
		e.preventDefault();
		if (isLiked.current === true) {
			isLiked.current = false;
			handlePaletteLike(params.id, userId.current, -1, setPalette);
		} else {
			isLiked.current = true;
			handlePaletteLike(params.id, userId.current, 1, setPalette);
		}
	};

	const handlePaletteDownload = (e) => {
		e.preventDefault();
		let paletteHTML = `
			<div class="downloadPaletteStyle">
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
			</div>
		`;
		const paletteRef = document.createElement("div");
		paletteRef.classList.add("downloadPaletteStyleWrapper");
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
		handleInteraction("download_palette", { paletteId: palette.id });
		setTimeout(() => {
			if (
				document.body.lastChild.classList.contains(
					"downloadPaletteStyleWrapper"
				)
			) {
				document.body.lastChild.remove();
			}
		}, 5000);
	};

	return (
		<>
			{error && <Redirect to="/" />}
			{!palette && <div className="wrapper">Loading Detailed Palette...</div>}
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
								onClick={(e) => handleCopyToClipBoard(e, params.id)}
							>
								<span>{"#" + color.toUpperCase()}</span>
							</motion.div>
						))}
					</div>

					<BigLikeButton
						isLiked={isLiked.current === true}
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
							{palette.tags
								.slice(0, Math.min(5, palette.tags.length))
								.map((tag, index) => (
									<Link key={index} to={"/palettes/" + tag}>
										#{tag}
									</Link>
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
