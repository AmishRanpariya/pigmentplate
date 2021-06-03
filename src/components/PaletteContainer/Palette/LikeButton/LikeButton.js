import React from "react";

//for Palette.js
const LikeButton = ({ isLiked, likeCount, onclicked }) => {
	const toShortForm = (num, digits) => {
		const lookup = [
			{ value: 1, symbol: "" },
			{ value: 1e3, symbol: "k" },
			{ value: 1e6, symbol: "M" },
			{ value: 1e9, symbol: "G" },
			{ value: 1e12, symbol: "T" },
			{ value: 1e15, symbol: "P" },
			{ value: 1e18, symbol: "E" },
		];
		const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
		var item = lookup
			.slice()
			.reverse()
			.find(function (item) {
				return num >= item.value;
			});
		return (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol;
	};

	return (
		<button
			className={isLiked ? "LikeButton btn liked" : "LikeButton btn "}
			onClick={onclicked}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="h-5 w-5"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					fillRule="evenodd"
					d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
					clipRule="evenodd"
				/>
			</svg>
			<div>{likeCount > 0 ? toShortForm(likeCount, 0) : likeCount}</div>
		</button>
	);
};

export default LikeButton;
