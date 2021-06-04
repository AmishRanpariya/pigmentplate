import React, { useEffect, useState } from "react";
import { LOCALSTORAGE } from "../../Const";

import MinimalPalette from "./MinimalPalette/MinimalPalette";
import "./ClientPaletteContainer.css";
import { Link } from "react-router-dom";
//for App.js
const ClientPaletteContainer = () => {
	const [favPalettes, setFavPalettes] = useState([]);
	const [myPalettes, setMyPalettes] = useState([]);
	console.log("ClientPaletteContainer rendered");

	const getLocalPalettes = (type, callback) => {
		const palettes = [];
		for (let index = 0, len = localStorage.length; index < len; index++) {
			let key = localStorage.key(index);
			if (key.indexOf(type) === 0) {
				let timestamp = localStorage.getItem(key);
				key = key.slice(key.length - 24);
				const palette = {
					id: key,
					savedAt: +timestamp,
					colors: [
						key.slice(0, 6),
						key.slice(6, 12),
						key.slice(12, 18),
						key.slice(18, 24),
					],
				};
				palettes.push(palette);
			}
		}
		callback([...palettes]);
	};

	useEffect(() => {
		getLocalPalettes(LOCALSTORAGE.prefix_created, setMyPalettes);
		getLocalPalettes(LOCALSTORAGE.prefix_liked, setFavPalettes);
		localStorage.setItem(
			LOCALSTORAGE.prefix_interaction,
			+localStorage.getItem(LOCALSTORAGE.prefix_interaction) + 1
		);
	}, []);

	let favPalettesJSX = (
		<div className="heading">Loading Favourites Palettes...</div>
	);
	if (favPalettes) {
		if (favPalettes.length > 0) {
			favPalettesJSX = (
				<div className="wrapper">
					{favPalettes
						.sort((a, b) => {
							return b.savedAt - a.savedAt;
						})
						.map((palette) => (
							<MinimalPalette key={palette.id} palette={palette} />
						))}
				</div>
			);
		} else {
			favPalettesJSX = (
				<div className="wrapper">
					<span>No Favourite Palettes Yet</span>
					<Link to="/" className="btn">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
						</svg>
						Back To Home
					</Link>
				</div>
			);
		}
	}

	let myPalettesJSX = <div className="heading">Loading Your Palettes...</div>;
	if (myPalettes) {
		if (myPalettes.length > 0) {
			myPalettesJSX = (
				<div className="wrapper">
					{myPalettes
						.sort((a, b) => {
							return b.savedAt - a.savedAt;
						})
						.map((palette) => (
							<MinimalPalette key={palette.id} palette={palette} />
						))}
				</div>
			);
		} else {
			myPalettesJSX = (
				<div className="wrapper">
					<span>No Palettes Created Yet</span>
					<Link to="/create" className="btn">
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
								d="M12 6v6m0 0v6m0-6h6m-6 0H6"
							/>
						</svg>
						Create New
					</Link>
				</div>
			);
		}
	}
	return (
		<div className="ClientPaletteContainer">
			<div className="partition">
				<div className="heading">Favourite Palettes</div>
				{favPalettesJSX}
			</div>
			<div className="partition">
				<div className="heading">Your Palettes</div>
				{myPalettesJSX}
			</div>
		</div>
	);
};

export default ClientPaletteContainer;
