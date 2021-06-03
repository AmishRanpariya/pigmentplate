import React, { useState } from "react";
import { useHistory } from "react-router";
import {
	DEFAULT_PALETTE,
	PALETTE_COLLECTION,
	USER_COLLECTION,
} from "../../Const";

import { db, firebase } from "../../firebase/config";

import ColorPicker from "../UI/ColorPicker/ColorPicker";
import "./CreatePalette.css";

//for App.js
const CreatePalette = ({ userId }) => {
	const [palette] = useState(DEFAULT_PALETTE);
	const [isPending, setIsPending] = useState(true);
	const [error, setError] = useState(null);

	const [tags, setTags] = useState("");
	const [color1, setColor1] = useState("#" + palette.colors[0]);
	const [color2, setColor2] = useState("#" + palette.colors[1]);
	const [color3, setColor3] = useState("#" + palette.colors[2]);
	const [color4, setColor4] = useState("#" + palette.colors[3]);

	const history = useHistory();

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
		_tags = _tags.slice(0, Math.min(4, _tags.length));

		if (paletteId.match(/[a-f\d]{24}/)) {
			const _palette = {
				id: paletteId,
				colors: [_col1, _col2, _col3, _col4],
				tags: [..._tags],
				likeCount: 0,
				createdAt: new Date().getTime(),
				createdBy: userId,
				likedBy: [],
				interactionCount: 1,
			};

			// Get a new write batch
			let batch = db.batch();

			let paletteRef = db
				.collection(PALETTE_COLLECTION.collection_name)
				.doc(_palette.id);
			batch.set(paletteRef, _palette);

			let userRef = db.collection(USER_COLLECTION.collection_name).doc(userId);
			batch.update(userRef, {
				interactionCount: firebase.firestore.FieldValue.increment(1),
				createdPalette: firebase.firestore.FieldValue.arrayUnion(_palette.id),
			});

			// Commit the batch
			batch
				.commit()
				.then(() => {
					setIsPending(false);
					setError(null);
					localStorage.setItem(
						"PigmentPlate/interactionCount",
						+localStorage.getItem("PigmentPlate/interactionCount") + 1
					);
					history.push("/palette/" + _palette.id);
				})
				.catch((err) => {
					console.log(err);
					setError(err.message);
					setIsPending(false);
				});
		} else {
			console.log("Invalid HEXCODE");
		}
	};

	return (
		<div className="CreatePalette">
			<div className=" ColorPicker">
				<div className="color-grid">
					<div className="color" style={{ backgroundColor: color1 }}></div>
					<div className="color" style={{ backgroundColor: color2 }}></div>
					<div className="color" style={{ backgroundColor: color3 }}></div>
					<div className="color" style={{ backgroundColor: color4 }}></div>
				</div>
				<div className="PickerGrid">
					<ColorPicker
						color={color1}
						onChangeHandler={(e) => {
							setColor1(e.hex);
						}}
					/>
					<ColorPicker
						color={color2}
						onChangeHandler={(e) => {
							setColor2(e.hex);
						}}
					/>
					<ColorPicker
						color={color3}
						onChangeHandler={(e) => {
							setColor3(e.hex);
						}}
					/>
					<ColorPicker
						color={color4}
						onChangeHandler={(e) => {
							setColor4(e.hex);
						}}
					/>
				</div>
				<div className="TagInput">
					<form>
						<label htmlFor="tags">Tags:</label>
						<input
							name="tags"
							placeholder="Lemon Yellow Summer"
							type="text"
							value={tags}
							onChange={(e) => setTags(e.target.value.toLowerCase())}
						/>
					</form>
					{isPending && (
						<button className="btn" onClick={handleCreatePalette}>
							Create
						</button>
					)}
					{!isPending && (
						<button className="btn" onClick={handleCreatePalette} disabled>
							Create
						</button>
					)}
				</div>
			</div>
			{error && <div>Something Went Wrong</div>}
		</div>
	);
};

export default CreatePalette;
