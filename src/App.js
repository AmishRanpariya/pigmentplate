import React, { Suspense, useEffect } from "react";
import { Switch, Route, NavLink, Redirect } from "react-router-dom";

import "./App.css";
import NavBar from "./components/NavBar/NavBar";
import Home from "./components/Home/Home";
import DetailedPalette from "./components/PaletteContainer/DetailedPalette/DetailedPalette";
import SortedPalettes from "./components/CustomPalettes/SortedPalettes";
import FilteredPalettes from "./components/CustomPalettes/FilteredPalettes";
import { PALETTE_COLLECTION } from "./Const";
import useAuth from "./hooks/useAuth";
import handleInteraction from "./funtions/handleInteraction";
import { fa } from "./firebase/config";
import About from "./components/About/About";

const CreatePalette = React.lazy(() =>
	import("./components/CreatePalette/CreatePalette")
);
const ClientPaletteContainer = React.lazy(() =>
	import("./components/PaletteContainer/ClientPaletteContainer")
);

//for index.js
const App = () => {
	const { user, error } = useAuth();

	useEffect(() => {
		document.title = "Home | Pigment Plate";
	}, []);

	useEffect(() => {
		if (user) {
			fa.setUserId(user.id);
			handleInteraction("app_visit");
		}
	}, [user]);

	return (
		<>
			<NavBar>
				<ul>
					<li>
						<NavLink to="/">
							<strong>PigmentPlate</strong>
						</NavLink>
					</li>
					<li>
						<Route path="/:s">
							<NavLink exact to="/" className="btn">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
								</svg>
							</NavLink>
						</Route>
					</li>
				</ul>
				<ul>
					<li className="hideOnSmall ">
						<NavLink to="/likes" className="btn">
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
							Fav
						</NavLink>
					</li>

					<li className="hideOnSmall ">
						<NavLink to="/create" className="btn">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 6v6m0 0v6m0-6h6m-6 0H6"
								/>
							</svg>{" "}
							Create
						</NavLink>
					</li>
					<li className="hideOnSmall ">
						<NavLink to="/popular" className="btn">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fillRule="evenodd"
									d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
									clipRule="evenodd"
								/>
							</svg>{" "}
							Popuar
						</NavLink>
					</li>
					<li className="hideOnSmall ">
						<NavLink to="/about" className="btn">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fillRule="evenodd"
									d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
									clipRule="evenodd"
								/>
							</svg>{" "}
							About
						</NavLink>
					</li>
					<li className="dropdownHover">
						<div className="btn">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 6h16M4 12h16m-7 6h7"
								/>
							</svg>
						</div>
						<ul className="dropdown">
							<li>
								<NavLink to="/likes" className="btn">
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
									Fav
								</NavLink>
							</li>
							<li>
								<NavLink to="/create" className="btn">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-6 w-6"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 6v6m0 0v6m0-6h6m-6 0H6"
										/>
									</svg>{" "}
									Create
								</NavLink>
							</li>
							<li>
								<NavLink to="/popular" className="btn">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
											clipRule="evenodd"
										/>
									</svg>{" "}
									Popuar
								</NavLink>
							</li>
							<li>
								<NavLink to="/about" className="btn">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
											clipRule="evenodd"
										/>
									</svg>{" "}
									About
								</NavLink>
							</li>
						</ul>
					</li>
				</ul>
			</NavBar>

			{!error ? (
				<div className="container">
					<Switch>
						<Route exact path="/create">
							<Suspense
								fallback={
									<div className="wrapper">Loading Create Palette...</div>
								}
							>
								{user && <CreatePalette userId={user.id} />}
							</Suspense>
						</Route>

						<Route exact path="/likes">
							<Suspense
								fallback={
									<div className="wrapper">Loading Favourite Palettes...</div>
								}
							>
								{user && <ClientPaletteContainer />}
							</Suspense>
						</Route>

						<Route exact path="/about">
							<About />
						</Route>
						{/* <Route exact path="/trendy">
							trending
						</Route> */}
						<Route exact path="/popular">
							{user && (
								<SortedPalettes
									orderby={PALETTE_COLLECTION.likeCount}
									isAsc={false}
								/>
							)}
						</Route>
						{/* <Route exact path="/random">
							random
						</Route> */}

						<Route exact path="/palette/:id([a-f\d]{24})">
							{user && <DetailedPalette />}
							{user && <Home />}
						</Route>
						<Route exact path="/palettes/:tagname">
							{user && <FilteredPalettes />}
						</Route>
						<Route path="/" exact>
							{user && <Home />}
						</Route>
						<Route path="*">
							<Redirect to="/" />
						</Route>
					</Switch>
				</div>
			) : (
				<div className="wrapper">Internet Connection Required</div>
			)}
		</>
	);
};
export default App;
