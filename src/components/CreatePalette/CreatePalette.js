import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { db, firebase, timestamp } from "../../firebase/config";

import {
	DEFAULT_PALETTE,
	LOCALSTORAGE,
	PALETTE_COLLECTION,
	USER_COLLECTION,
} from "../../Const";
import handleInteraction from "../../funtions/handleInteraction";
import ColorPicker from "./ColorPicker/ColorPicker";
import "./CreatePalette.css";
import TagList from "./TagList/TagList";

// "a21dcf" example
function hexToRGB(hexcode) {
	return {
		r: parseInt(hexcode.substring(0, 2), 16),
		g: parseInt(hexcode.substring(2, 4), 16),
		b: parseInt(hexcode.substring(4, 6), 16),
	};
}

function RGBToHSL(r, g, b) {
	r /= 255;
	g /= 255;
	b /= 255;

	let max = Math.max(r, g, b);
	let min = Math.min(r, g, b);
	let h;
	let s;
	let l = (max + min) / 2;

	if (max === min) {
		h = s = 0; // achromatic
	} else {
		let d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
			default:
				break;
		}

		h /= 6;
	}

	return {
		h: Math.round(h * 100),
		s: Math.round(s * 100),
		l: Math.round(l * 100),
	};
}

function suggestTags(rgbcolor) {
	const color = RGBToHSL(rgbcolor.r, rgbcolor.g, rgbcolor.b);

	const suggestedTags = [];
	const colorMap = [
		{
			color: "blue",
			hMin: 53,
			hMax: 70,
			sMin: 30,
			sMax: 100,
			lMin: 15,
			lMax: 95,
		},
		{
			color: "green",
			hMin: 22,
			hMax: 43,
			sMin: 30,
			sMax: 100,
			lMin: 15,
			lMax: 95,
		},
		{
			color: "red",
			hMin: 0,
			hMax: 2,
			sMin: 50,
			sMax: 100,
			lMin: 30,
			lMax: 70,
		},
		{
			color: "red",
			hMin: 95,
			hMax: 100,
			sMin: 50,
			sMax: 100,
			lMin: 30,
			lMax: 70,
		},
		{
			color: "pink",
			hMin: 85,
			hMax: 100,
			sMin: 50,
			sMax: 100,
			lMin: 60,
			lMax: 100,
		},
		{
			color: "black",
			hMin: 0,
			hMax: 100,
			sMin: 0,
			sMax: 100,
			lMin: 0,
			lMax: 8,
		},
		{
			color: "yellow",
			hMin: 12,
			hMax: 18,
			sMin: 60,
			sMax: 100,
			lMin: 50,
			lMax: 100,
		},
		{
			color: "grey",
			hMin: 0,
			hMax: 100,
			sMin: 0,
			sMax: 10,
			lMin: 20,
			lMax: 90,
		},
		{
			color: "orange",
			hMin: 3,
			hMax: 10,
			sMin: 70,
			sMax: 100,
			lMin: 40,
			lMax: 80,
		},
		{
			color: "white",
			hMin: 0,
			hMax: 100,
			sMin: 0,
			sMax: 100,
			lMin: 97,
			lMax: 100,
		},
		{
			color: "brown",
			hMin: 3,
			hMax: 10,
			sMin: 20,
			sMax: 100,
			lMin: 10,
			lMax: 40,
		},
		{
			color: "purple",
			hMin: 70,
			hMax: 88,
			sMin: 30,
			sMax: 100,
			lMin: 20,
			lMax: 90,
		},
		{
			color: "beige",
			hMin: 8,
			hMax: 15,
			sMin: 30,
			sMax: 90,
			lMin: 80,
			lMax: 100,
		},
		{
			color: "navy",
			hMin: 53,
			hMax: 70,
			sMin: 30,
			sMax: 100,
			lMin: 15,
			lMax: 30,
		},
		{
			color: "peach",
			hMin: 0,
			hMax: 7,
			sMin: 50,
			sMax: 100,
			lMin: 70,
			lMax: 100,
		},
		{
			color: "teal",
			hMin: 48,
			hMax: 50,
			sMin: 30,
			sMax: 100,
			lMin: 15,
			lMax: 95,
		},
		{
			color: "maroon",
			hMin: 0,
			hMax: 3,
			sMin: 50,
			sMax: 100,
			lMin: 10,
			lMax: 40,
		},
		{
			color: "maroon",
			hMin: 95,
			hMax: 100,
			sMin: 50,
			sMax: 100,
			lMin: 10,
			lMax: 40,
		},
	];
	colorMap.forEach((tag) => {
		if (
			color["h"] >= tag["hMin"] &&
			color["h"] <= tag["hMax"] &&
			color["s"] >= tag["sMin"] &&
			color["s"] <= tag["sMax"] &&
			color["l"] >= tag["lMin"] &&
			color["l"] <= tag["lMax"]
		) {
			suggestedTags.push(tag["color"]);
		}
	});
	return suggestedTags;
}

//for App.js
const CreatePalette = ({ userId }) => {
	const [palette] = useState(DEFAULT_PALETTE);
	const [isPending, setIsPending] = useState(true);
	const [error, setError] = useState(null);

	//default initial color
	const [color1, setColor1] = useState("#" + palette.colors[0]);
	const [color2, setColor2] = useState("#" + palette.colors[1]);
	const [color3, setColor3] = useState("#" + palette.colors[2]);
	const [color4, setColor4] = useState("#" + palette.colors[3]);

	useEffect(() => {
		document.title = "Create Palette | Pigment Plate";
		handleInteraction("create_palette_open");
	}, []);

	const [tagList, setTagList] = useState([
		{
			text: "red",
			isActive: false,
		},
		{
			text: "green",
			isActive: false,
		},
		{
			text: "blue",
			isActive: false,
		},
		{
			text: "black",
			isActive: false,
		},
		{
			text: "white",
			isActive: false,
		},
		{
			text: "yellow",
			isActive: false,
		},
		{
			text: "pink",
			isActive: false,
		},
		{
			text: "violet",
			isActive: false,
		},
		{
			text: "purple",
			isActive: false,
		},
		{
			text: "orange",
			isActive: false,
		},
		{
			text: "brown",
			isActive: false,
		},
		{
			text: "turquoise",
			isActive: false,
		},
		{
			text: "grey",
			isActive: false,
		},
		{
			text: "navy",
			isActive: false,
		},
		{
			text: "beige",
			isActive: false,
		},
		{
			text: "peach",
			isActive: false,
		},
		{
			text: "teal",
			isActive: false,
		},
		{
			text: "maroon",
			isActive: false,
		},
		{
			text: "warm",
			isActive: false,
		},
		{
			text: "cold",
			isActive: false,
		},
		{
			text: "bright",
			isActive: false,
		},
		{
			text: "neon",
			isActive: false,
		},
		{
			text: "gold",
			isActive: false,
		},
		{
			text: "pastel",
			isActive: false,
		},
		{
			text: "skin",
			isActive: false,
		},
		{
			text: "happy",
			isActive: false,
		},
		{
			text: "kids",
			isActive: false,
		},
		{
			text: "food",
			isActive: false,
		},
		{
			text: "rainbow",
			isActive: false,
		},
		{
			text: "space",
			isActive: false,
		},
		{
			text: "earth",
			isActive: false,
		},
		{
			text: "ocean",
			isActive: false,
		},
		{
			text: "nature",
			isActive: false,
		},
		{
			text: "cream",
			isActive: false,
		},
		{
			text: "coffee",
			isActive: false,
		},
		{
			text: "vintage",
			isActive: false,
		},
		{
			text: "wedding",
			isActive: false,
		},
		{
			text: "sunset",
			isActive: false,
		},
		{
			text: "summer",
			isActive: false,
		},
		{
			text: "automn",
			isActive: false,
		},
		{
			text: "winter",
			isActive: false,
		},
		{
			text: "spring",
			isActive: false,
		},
	]);

	const handleTagClick = (e) => {
		if (
			e.target.classList.contains("activeTag") &&
			+e.target.dataset.id < tagList.length
		) {
			setTagList((_tagList) => {
				_tagList[+e.target.dataset.id].isActive = false;
				return [..._tagList];
			});
		} else {
			setTagList((_tagList) => {
				_tagList[+e.target.dataset.id].isActive = true;
				return [..._tagList];
			});
		}
	};

	const getRandomColor = () => {
		const digits = "0123456789abcdef".split("");
		const colors = [];
		for (let j = 0; j < 4; j++) {
			let _col = "#";
			for (let i = 0; i < 6; i++) {
				_col += digits[Math.floor(Math.random() * digits.length)];
			}
			colors.push(_col);
		}
		colors.sort();
		if (Math.random() > 0.5) {
			colors.reverse();
		}
		setColor1(colors[0]);
		setColor2(colors[1]);
		setColor3(colors[2]);
		setColor4(colors[3]);
	};

	//for random initial color
	useEffect(() => {
		getRandomColor();
		const handleKeyPress = (e) => {
			if (e.keyCode === 43) {
				//num plus
				getRandomColor();
			}
		};
		window.addEventListener("keypress", handleKeyPress);
		return () => {
			window.removeEventListener("keypress", handleKeyPress);
		};
	}, []);

	const _history = useHistory();
	const handleChangeColor1 = useCallback((e) => {
		setColor1(e.hex);
	}, []);
	const handleChangeColor2 = useCallback((e) => {
		setColor2(e.hex);
	}, []);
	const handleChangeColor3 = useCallback((e) => {
		setColor3(e.hex);
	}, []);
	const handleChangeColor4 = useCallback((e) => {
		setColor4(e.hex);
	}, []);

	const handleCreatePalette = (e) => {
		e.preventDefault();
		const _col1 = color1.slice(1, 7).toLowerCase();
		const _col2 = color2.slice(1, 7).toLowerCase();
		const _col3 = color3.slice(1, 7).toLowerCase();
		const _col4 = color4.slice(1, 7).toLowerCase();
		const paletteId = _col1 + _col2 + _col3 + _col4;

		let col1Tag = suggestTags(hexToRGB(_col1)).map((tagtext) =>
			tagtext.toLowerCase()
		);
		let col2Tag = suggestTags(hexToRGB(_col2)).map((tagtext) =>
			tagtext.toLowerCase()
		);
		let col3Tag = suggestTags(hexToRGB(_col3)).map((tagtext) =>
			tagtext.toLowerCase()
		);
		let col4Tag = suggestTags(hexToRGB(_col4)).map((tagtext) =>
			tagtext.toLowerCase()
		);

		let _tags = tagList.filter((tag) => tag.isActive).map((tag) => tag.text);

		_tags = [
			...new Set([..._tags, ...col1Tag, ...col2Tag, ...col3Tag, ...col4Tag]),
		];
		if (paletteId.match(/[a-f\d]{24}/)) {
			const _palette = {
				id: paletteId,
				colors: [_col1, _col2, _col3, _col4],
				tags: [..._tags],
				col1Tag,
				col2Tag,
				col3Tag,
				col4Tag,
				likeCount: 0,
				createdAt: timestamp(),
				createdBy: userId,
				interactionCount: 1,
				status: "inreview",
			};
			//first check if palette already created
			db.collection(PALETTE_COLLECTION.collection_name)
				.doc(_palette.id)
				.get()
				.then((snap) => {
					if (snap && snap.exists) {
						//already exist
						// console.log("already exist");
						_history.push("/palette/" + _palette.id);
						handleInteraction("error_dupilicate_palette_create", {
							paletteId,
							err: "duplicate palette",
						});
					} else {
						//doesnt exist

						// Get a new write batch
						let batch = db.batch();

						let paletteRef = db
							.collection(PALETTE_COLLECTION.collection_name)
							.doc(_palette.id);
						batch.set(paletteRef, _palette);

						let userRef = db
							.collection(USER_COLLECTION.collection_name)
							.doc(userId);
						batch.update(userRef, {
							interactionCount: firebase.firestore.FieldValue.increment(1),
							createdPalette: firebase.firestore.FieldValue.arrayUnion(
								_palette.id
							),
							lastActivityAt: timestamp(),
						});

						// Commit the batch
						batch
							.commit()
							.then(() => {
								setIsPending(false);
								setError(null);

								handleInteraction("palette_created", { paletteId });

								const _user = JSON.parse(
									localStorage.getItem(LOCALSTORAGE.prefix_cached_user)
								);
								_user.createdPalette.push(paletteId);

								localStorage.setItem(
									LOCALSTORAGE.prefix_cached_user,
									JSON.stringify(_user)
								);

								_history.push("/palette/" + _palette.id);
							})
							.catch((err) => {
								console.log(err);
								handleInteraction("error_palette_created", {
									paletteId,
									err: err.message,
								});
								setError(err.message);
								setIsPending(false);
							});
					}
				})
				.catch((err) => {
					handleInteraction("error_in_checking_dupilicate_palette_create", {
						paletteId,
						err: err.message,
					});
					//couldnt fetch data due to network error but may be data exist
					// console.log("error catched at checking for createPalette");
				});
		} else {
			handleInteraction("warn_invalidHEX_palette_created", {
				paletteId,
				err: "invalid HEX",
				title: document.title,
			});
			console.log("Invalid HEXCODE");
		}
	};

	return (
		<>
			<div className="CreatePalette">
				<div className=" ColorPicker">
					<div className="color-grid">
						<div className="color" style={{ backgroundColor: color1 }}></div>
						<div className="color" style={{ backgroundColor: color2 }}></div>
						<div className="color" style={{ backgroundColor: color3 }}></div>
						<div className="color" style={{ backgroundColor: color4 }}></div>
					</div>
					<div className="PickerGrid">
						<ColorPicker color={color1} onChangeHandler={handleChangeColor1} />
						<ColorPicker color={color2} onChangeHandler={handleChangeColor2} />
						<ColorPicker color={color3} onChangeHandler={handleChangeColor3} />
						<ColorPicker color={color4} onChangeHandler={handleChangeColor4} />
					</div>
					<div className="TagInput">
						<div className="tagWrapper">
							<TagList tagList={tagList} handleClick={handleTagClick} />
						</div>
						<button
							className="btn createBtn"
							onClick={handleCreatePalette}
							disabled={!isPending}
						>
							Create
						</button>
					</div>
					{error && <div>Something Went Wrong</div>}
				</div>
			</div>
		</>
	);
};

export default CreatePalette;
