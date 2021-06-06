import { Switch, Route, NavLink, Redirect } from "react-router-dom";

import "./App.css";
import CreatePalette from "./components/CreatePalette/CreatePalette";
import NavBar from "./components/NavBar/NavBar";
import DetailedPalette from "./components/PaletteContainer/DetailedPalette/DetailedPalette";
import ClientPaletteContainer from "./components/PaletteContainer/ClientPaletteContainer";
import Home from "./components/Home/Home";
import useFetchFirestoreUser from "./hooks/useFetchFirestoreUser";

//for index.js
const App = () => {
	const { user, error } = useFetchFirestoreUser();
	return (
		<>
			<NavBar>
				<ul>
					<li>
						<NavLink to="/">
							<strong>PigmentPlate</strong>
						</NavLink>
					</li>
				</ul>
				<ul>
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

					<li id="createBtnLink">
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
							</svg>
							Create
						</NavLink>
					</li>
				</ul>
			</NavBar>
			{!error ? (
				<div className="container">
					<Switch>
						<Route exact path="/create">
							{user ? (
								<CreatePalette userId={user.id} />
							) : (
								<div>Loading Create Palette...</div>
							)}
						</Route>

						<Route exact path="/likes">
							<ClientPaletteContainer />
						</Route>

						<Route exact path="/about">
							about
						</Route>
						<Route exact path="/palette/trendy">
							trending
						</Route>
						<Route exact path="/palette/popular">
							popular
						</Route>
						<Route exact path="/palette/random">
							random
						</Route>

						<Route exact path="/palette/:id([a-f\d]{24})">
							{user ? (
								<>
									<DetailedPalette />
									<Home />
								</>
							) : (
								<div>Loading Detailed Palettes...</div>
							)}
						</Route>
						<Route path="/" exact>
							{user ? <Home /> : <div>Loading Palettes...</div>}
						</Route>
						<Route path="*">
							<Redirect to="/" />
						</Route>
						<Route />
					</Switch>
				</div>
			) : (
				<div className="wrapper">Something Went Wrong In App.js</div>
			)}
		</>
	);
};

export default App;
