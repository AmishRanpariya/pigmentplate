const handleColorPicker = (e) => {
	console.log("picker ran");
	// let controllers = document.querySelectorAll(".color");
	// let ColorPicker = document.querySelector(".ColorPicker");
	// let Picker = document.querySelector(".Picker");
	// controllers.forEach((controller) => {
	// 	controller.addEventListener("click", (e) => {
	// 		// e.stopPropagation();
	// 		if (e.target.classList.contains("color")) {
	// 			console.log("hell yeah");
	// 			Picker.innerHTML = "";

	// 			if (!e.target.classList.contains("active")) {
	// 				controllers.forEach((controller) => {
	// 					controller.classList.remove("active");
	// 				});
	// 				e.target.classList.toggle("active");

	// 				let color_picker = new ColorPickerControl({
	// 					container: Picker,
	// 					theme: "dark",
	// 					use_alpha: false,
	// 				});

	// 				color_picker.on("change", function (color) {
	// 					e.target.style.setProperty("background-color", color.toHEX());
	// 					console.log(color.toHEX());
	// 				});
	// 			} else {
	// 				e.target.classList.remove("active");
	// 			}
	// 		} else {
	// 			Picker.innerHTML = "";
	// 		}
	// 		// console.log(e.target.getAttribute("data-id"));
	// 	});
	// 	ColorPicker &&
	// 		ColorPicker.addEventListener("click", (e) => {
	// 			// Picker.innerHTML = "";
	// 		});
	// });
};

// document.addEventListener("DOMContentLoaded", handleColorPicker);
// document.addEventListener("popstate", handleColorPicker);
