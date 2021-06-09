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

//for App.js
const CreatePalette = ({ userId }) => {
	const [palette] = useState(DEFAULT_PALETTE);
	const [isPending, setIsPending] = useState(true);
	const [error, setError] = useState(null);

	const [tags, setTags] = useState("");

	//default initial color
	const [color1, setColor1] = useState("#" + palette.colors[0]);
	const [color2, setColor2] = useState("#" + palette.colors[1]);
	const [color3, setColor3] = useState("#" + palette.colors[2]);
	const [color4, setColor4] = useState("#" + palette.colors[3]);

	useEffect(() => {
		document.title = "Create Palette | Pigment Plate";
		handleInteraction("create_palette_open");
	}, []);

	const [taglist] = useState([
		"red",
		"green",
		"blue",
		"black",
		"white",
		"yellow",
		"pink",
		"violet",
		"purple",
		"orange",
		"brown",
		"turquoise",
		"gray",
		"warm",
		"cold",
		"bright",
		"neon",
		"gold",
		"pastel",
		"skin",
		"vintage",
		"wedding",
		"sunset",
		"summer",
		"automn",
		"winter",
		"spring",
	]);

	const handleTagClick = (e) => {
		if (
			e.target.classList.contains("activeTag") &&
			+e.target.dataset.id < taglist.length
		) {
			setTags((_tags) =>
				_tags
					.split(" ")
					.filter((tag) => tag !== taglist[+e.target.dataset.id])
					.join(" ")
			);
		} else {
			setTags((_tags) => _tags + " " + taglist[+e.target.dataset.id]);
		}
	};

	const getRandomColor = () => {
		const digits = "0123456789abcdef".split("");
		const colors = [];
		for (let j = 0; j < 4; j++) {
			let _col = "#";
			for (let i = 0; i < 6; i++) {
				_col += digits[Math.floor(Math.random() * 16)];
			}
			colors.push(_col);
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

		let _tags = [
			...new Set(
				tags.split(" ").filter((tag) => tag.trim().match(/^[A-Za-z]{1,15}$/))
			),
		];
		_tags = _tags.slice(0, Math.min(10, _tags.length));

		if (paletteId.match(/[a-f\d]{24}/)) {
			const _palette = {
				id: paletteId,
				colors: [_col1, _col2, _col3, _col4],
				tags: [..._tags],
				likeCount: 0,
				createdAt: timestamp(),
				createdBy: userId,
				likedBy: [],
				interactionCount: 1,
			};
			//first check if palette already created
			db.collection(PALETTE_COLLECTION.collection_name)
				.doc(_palette.id)
				.get()
				.then((snap) => {
					if (snap && snap.exists) {
						//already exist
						console.log("already exist");
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
						});

						// Commit the batch
						batch
							.commit()
							.then(() => {
								setIsPending(false);
								setError(null);
								handleInteraction("palette_created", { paletteId });
								localStorage.setItem(
									LOCALSTORAGE.prefix_created + paletteId,
									Date.now()
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
					console.log("error catched at checking for createPalette");
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
							<TagList taglist={taglist} handleClick={handleTagClick} />
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
