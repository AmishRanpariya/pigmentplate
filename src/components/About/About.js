import React from "react";
import { NavLink } from "react-router-dom";

import "./About.css";
const About = () => {
	return (
		<div className="aboutWrapper">
			<h2>
				Who's behind
				<br /> Pigment Plate?
			</h2>
			<p>
				Hi there 👋 My name is{" "}
				<a href="https://github.com/AmishRanpariya" rel="noreferrer">
					Amish Ranpariya
				</a>
				, I'm the creator of Pigment Plate. One of my favorite things to do is
				create fun, useful, and sometimes silly side-projects. My goal with
				Pigment Plate is to try to give you an environment to share your color
				inspiration that others can use.
			</p>
			<h2>What is Pigment Plate?</h2>
			<p>
				<NavLink to="/">Pigment Plate</NavLink> is an open collection of color
				palettes 🌈. Pigment Plate is started as a personal small project built
				to share trendy color combinations between developers and artists.
				Inspired by{" "}
				<a href="https://colorhunt.co" rel="noreferrer">
					colorhunt.co
				</a>
				.
			</p>

			<h2>Who is it for?</h2>
			<p>
				The color palettes are being used by graphic designers, artists,
				illustrators, web developers, fashion designers, marketers, interior
				designers, and more. Pigment Plate serves hundreds of color schemes for
				many different design and art purposes. People use Pigment Plate to get
				color inspiration and find the perfect palette for their projects.
				Anyone can save their favorite palettes, manage their collection, and
				have quick access to copy the color codes.
			</p>

			<h2>Who creates the palettes?</h2>
			<p>
				You, the users, are the ones who create the palettes using Pigment
				Plate’s palette creator. The collection is open, and everyone can create
				and submit their own color combination. That’s how we keep Pigment Plate
				diverse, colorful, social, and inspiring. Each palette is public
				property and not owned by a specific creator, nor by Pigment Plate.
			</p>
			<p>
				For any feedback, suggestions, or partnership opportunities, reach out
				to <span> amishranpariya@gmail.com </span>
			</p>
		</div>
	);
};

export default About;
