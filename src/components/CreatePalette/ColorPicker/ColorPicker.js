import React, { useState } from "react";
import { SketchPicker } from "react-color";

import "./ColorPicker.css";

const ColorPicker = (props) => {
	const [displayColorPicker, setDisplayColorPicker] = useState(false);

	const handleClick = () => {
		setDisplayColorPicker((displayColorPicker) => !displayColorPicker);
	};

	const handleClose = () => {
		setDisplayColorPicker(false);
	};

	return (
		<div className="">
			<div className="swatch" onClick={handleClick} tabIndex="0">
				<div className="colorBox" style={{ backgroundColor: props.color }} />
			</div>
			{displayColorPicker ? (
				<div className="popover">
					<div className="cover" onClick={handleClose} />
					<SketchPicker
						className="Picker"
						disableAlpha
						// presetColors={[]}
						color={props.color}
						onChangeComplete={props.onChangeHandler}
					/>
				</div>
			) : null}
		</div>
	);
};

export default ColorPicker;
// import React, { memo } from "react";
// import InputColor from "react-input-color";

// //for CreatePalette.js
// const ColorPicker = memo(({ color, onChangeHandler }) => {
// 	return (
// 		<div className="Picker">
// 			<InputColor
// 				initialValue={color}
// 				onChange={onChangeHandler}
// 				placement="bottom"
// 			/>
// 		</div>
// 	);
// });

// export default ColorPicker;
