import { Switch, Route, Link, Redirect } from "react-router-dom";

import "./App.css";
import CreatePalette from "./components/CreatePaletteReact/CreatePalette";
import NavBar from "./components/NavBar/NavBar";
import DetailedPalette from "./components/PaletteContainer/DetailedPalette/DetailedPalette";
import LikedPaletteContainer from "./components/PaletteContainer/LikedPaletteContainer";
import Home from "./components/Home/Home";
import useFetchFirestoreUser from "./firebase/useFetchFirestoreUser";

//for index.js
const App = () => {
	const { user, error } = useFetchFirestoreUser();

	return (
		<>
			<NavBar>
				<ul>
					<li>
						<Link to="/">PigmentPlate</Link>
					</li>
				</ul>
				<ul>
					<li>
						<Link to="/likes" className="btn">
							❤ Fav
						</Link>
					</li>
					<li id="createBtnLink">
						<Link to="/create" className="btn">
							create
						</Link>
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
							<LikedPaletteContainer />
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
									<DetailedPalette userId={user.id} />
									<Home userId={user.id} />
								</>
							) : (
								<div>Loading Detailed Palettes...</div>
							)}
						</Route>
						<Route path="/" exact>
							{user ? (
								<Home userId={user.id} />
							) : (
								<div>Loading Palettes...</div>
							)}
						</Route>
						<Route path="*">
							<Redirect to="/" />
						</Route>
					</Switch>
				</div>
			) : (
				<div>Something Went Wrong In App.js</div>
			)}
		</>
	);
};

export default App;
