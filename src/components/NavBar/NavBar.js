import React from "react";

import "./NavBar.css";

//for App.js
const NavBar = (props) => {
	return <nav className="NavBar">{props.children}</nav>;
};

export default NavBar;
