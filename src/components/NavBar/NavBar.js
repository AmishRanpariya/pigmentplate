import React, { memo } from "react";

import "./NavBar.css";

//for App.js
const NavBar = memo((props) => {
	console.log("NAV rendered");
	return <nav className="NavBar">{props.children}</nav>;
});

export default NavBar;
