import { LOCALSTORAGE } from "../Const";
import { fa } from "../firebase/config";

const handleInteraction = (event, data = {}) => {
	fa.logEvent(event, data);

	localStorage.setItem(
		LOCALSTORAGE.prefix_interaction,
		+localStorage.getItem(LOCALSTORAGE.prefix_interaction) + 1
	);
};
export default handleInteraction;
