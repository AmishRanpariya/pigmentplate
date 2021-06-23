import { PALETTE_COLLECTION } from "../Const";
import { db, firebase } from "../firebase/config";
import handleInteraction from "./handleInteraction";

export const handleCopyToClipBoard = (e, paletteId) => {
	e.preventDefault();

	const colorCode = e.target.innerText.substr(1).toLowerCase();
	// db.collection(COLORS_COLLECTION.collection_name)
	// 	.doc(colorCode)
	// 	.set({
	// 		codeCopyCount: firebase.firestore.FieldValue.increment(1),
	// 	});
	const docRef = db
		.collection(PALETTE_COLLECTION.collection_name)
		.doc(paletteId);

	switch (paletteId.indexOf(colorCode) / 6) {
		case 0:
			docRef.update({
				interactionCount: firebase.firestore.FieldValue.increment(1),
				col1CopyCount: firebase.firestore.FieldValue.increment(1),
			});
			break;
		case 1:
			docRef.update({
				interactionCount: firebase.firestore.FieldValue.increment(1),
				col2CopyCount: firebase.firestore.FieldValue.increment(1),
			});
			break;
		case 2:
			docRef.update({
				interactionCount: firebase.firestore.FieldValue.increment(1),
				col3CopyCount: firebase.firestore.FieldValue.increment(1),
			});
			break;
		case 3:
			docRef.update({
				interactionCount: firebase.firestore.FieldValue.increment(1),
				col4CopyCount: firebase.firestore.FieldValue.increment(1),
			});
			break;
		default:
			console.log("unexpected color hex copied");
	}

	//to copy HEXcode on clipboard by clicking this
	let temp = document.createElement("input");
	document.body.appendChild(temp);
	temp.value = e.target.innerText;
	temp.select();
	document.execCommand("copy");
	temp.remove();

	handleInteraction("color_hex_copied", { color: e.target.innerText });

	const emojis = [
		"🥰",
		"💝",
		"💘",
		"😍",
		"😘",
		"👍",
		"🤞",
		"💖",
		"😉",
		"😎",
		"🎉",
		"😃",
		"😜",
		"😇",
		"🥳",
		"👻",
		"🦄",
		"🦚",
		"🦋",
		"🐝",
		"🧚‍♀️",
		"🧚‍♂️",
		"💃",
		"💪",
		"🤙",
		"👌",
		"👏",
		"🙌",
		"🎊",
		"🎯",
		"🍬",
		"🍫",
		"🧁",
		"🍭",
		"🍨",
		"🥂",
		"🍻",
		"🍾",
		"🍒",
		"🍀",
		"🍁",
		"🌟",
		"🌈",
		"🔥",
		"⛄",
	];
	//tooltip
	let tip = document.createElement("div");
	tip.innerHTML = `
	<p>
		Copied! ${emojis[Math.floor(Math.random() * emojis.length)]}
	</p>`;
	tip.classList.add("btn");
	tip.classList.add("tip");
	tip.setAttribute(
		"style",
		`opacity:0.8; transform:translate(${e.pageX - 25}px,${e.pageY + 15}px)`
	);
	document.body.append(tip);
	setTimeout(() => {
		document.querySelector(".tip").remove();
	}, 1000);
};
