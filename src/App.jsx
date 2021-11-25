import React, { useCallback, useRef } from "react";
import Header from "./components/header";
import SplitScreen from "./components/split-screen";
import ActionBar from "./components/action-bar";
import Editor from "./components/editor";
import Board from "./components/board";
function App() {
	const boardRef = useRef();

	return (
		<div className="font-squada">
			<Header />
			<section className="split-screen-parent overflow-hidden">
				<SplitScreen split="vertical">
					<Board ref={boardRef} />
					<Editor />
				</SplitScreen>
			</section>
			<ActionBar onExport={() => boardRef.current.handleExport()} />
		</div>
	);
}

export default App;
