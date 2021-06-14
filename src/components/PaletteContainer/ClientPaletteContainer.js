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
				<div className="wrapper vertical">
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
							d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
						/>
					</svg>

					<span>No palettes in collection</span>
					<p>You haven't liked anything yet!</p>
					<Link to="/" className="btn">
						Find beautiful palettes
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
				<div className="wrapper vertical">
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
							d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<span>No palettes in your collection</span>
					<p>You haven't created anything yet!</p>
					<Link to="/create" className="btn">
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
