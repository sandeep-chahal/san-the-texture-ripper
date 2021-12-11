import React, { useState, useEffect } from "react";
import ReactGA from "react-ga";
import Header from "./components/header";
import SplitScreen from "./components/split-screen";
import Editor from "./components/editor";
import Board from "./components/board";
import Output from "./components/output";
function App() {
	const [showOutput, setShowOutput] = useState(false);
	useEffect(() => {
		ReactGA.initialize(import.meta.env.VITE_TRACKING_ID);
		ReactGA.pageview("/");
	}, []);
	return (
		<div className="font-squada animate-opacity">
			<Header onExport={() => setShowOutput(true)} />
			<section className="split-screen-parent overflow-hidden">
				<SplitScreen split="vertical">
					<Board />
					<Editor />
				</SplitScreen>
			</section>
			{showOutput && <Output onClose={() => setShowOutput(false)} />}
		</div>
	);
}

export default App;
