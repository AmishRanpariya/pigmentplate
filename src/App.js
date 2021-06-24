import React, { Suspense, useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { fa } from "./firebase/config";

import "./App.css";
import { PALETTE_COLLECTION } from "./Const";
import NavBar from "./components/NavBar/NavBar";
import Footer from "./components/Footer/Footer";
import Home from "./components/Home/Home";
import DetailedPalette from "./components/PaletteContainer/DetailedPalette/DetailedPalette";
import SortedPalettes from "./components/CustomPalettes/SortedPalettes";
import FilteredPalettes from "./components/CustomPalettes/FilteredPalettes";
import About from "./components/About/About";
import handleInteraction from "./funtions/handleInteraction";
import useAuth from "./hooks/useAuth";

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
			<NavBar />

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
			<Footer />
		</>
	);
};
export default App;
