import { Link } from "react-router-dom";

//for none
const NotFound = () => {
	return (
		<div className="not-found">
			<h2>Sorry</h2>
			<p>That page not available</p>
			<Link to="/">Back to Home...</Link>
		</div>
	);
};

export default NotFound;
