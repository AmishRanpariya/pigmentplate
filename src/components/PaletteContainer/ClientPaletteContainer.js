import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import MinimalPalette from "./MinimalPalette/MinimalPalette";
import "./ClientPaletteContainer.css";
import handleInteraction from "../../funtions/handleInteraction";
import { LOCALSTORAGE } from "../../Const";

//for App.js
const ClientPaletteContainer = () => {
	const [favPalettes, setFavPalettes] = useState([]);
	const [myPalettes, setMyPalettes] = useState([]);

	const getLocalPaletteFromUser = (type, callback) => {
		const _user = JSON.parse(
			localStorage.getItem(LOCALSTORAGE.prefix_cached_user)
		);
		const palettes = _user[type].map((paletteId) => {
			return {
				id: paletteId,
				colors: [
					paletteId.slice(0, 6),
					paletteId.slice(6, 12),
					paletteId.slice(12, 18),
					paletteId.slice(18, 24),
				],
			};
		});
		callback(palettes);
	};

	useEffect(() => {
		document.title = "My Favourites | Pigment Plate";
		getLocalPaletteFromUser("likedPalette", setFavPalettes);
		getLocalPaletteFromUser("createdPalette", setMyPalettes);
		handleInteraction("fav_page_open");
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
