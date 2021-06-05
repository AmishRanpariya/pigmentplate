import React, { memo } from "react";
import InputColor from "react-input-color";

//for CreatePalette.js
const ColorPicker = memo(({ color, onChangeHandler }) => {
	return (
		<div className="Picker">
			<InputColor
				initialValue={color}
				onChange={onChangeHandler}
				placement="bottom"
			/>
		</div>
	);
});

export default ColorPicker;
