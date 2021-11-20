import React from "react";
import Header from "./components/header";
import SplitScreen from "./components/split-screen";

function App() {
	return (
		<div>
			<Header />
			<section className="split-screen-parent">
				<SplitScreen split="vertical">
					<div className="bg-red-700 h-full">1</div>
					<div className="bg-blue-900 h-full">2</div>
				</SplitScreen>
			</section>
		</div>
	);
}

export default App;
