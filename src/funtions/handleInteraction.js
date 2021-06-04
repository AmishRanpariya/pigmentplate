import { LOCALSTORAGE } from "../Const";

const handleInteraction = () => {
	localStorage.setItem(
		LOCALSTORAGE.prefix_interaction,
		+localStorage.getItem(LOCALSTORAGE.prefix_interaction) + 1
	);
};
export default handleInteraction;
