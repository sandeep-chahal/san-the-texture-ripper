import React from "react";
import Header from "./components/header";
import SplitScreen from "./components/split-screen";
import ActionBar from "./components/action-bar";
import Editor from "./components/editor";
function App() {
	return (
		<div className="font-squada">
			<Header />
			<section className="split-screen-parent">
				<SplitScreen split="vertical">
					<div className="bg-primary2 h-full">1</div>
					<Editor />
				</SplitScreen>
			</section>
			<ActionBar />
		</div>
	);
}

export default App;
