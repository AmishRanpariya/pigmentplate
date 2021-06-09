import handleInteraction from "./handleInteraction";

export const handleCopyToClipBoard = (e) => {
	e.preventDefault();

	//to copy HEXcode on clipboard by clicking this
	let temp = document.createElement("input");
	document.body.appendChild(temp);
	temp.value = e.target.innerText;
	temp.select();
	document.execCommand("copy");
	temp.remove();

	console.log("colorHEX copied");
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
