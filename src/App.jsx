import React, { useCallback, useRef, useState } from "react";
import Header from "./components/header";
import SplitScreen from "./components/split-screen";
import ActionBar from "./components/action-bar";
import Editor from "./components/editor";
import Board from "./components/board";
import Output from "./components/output";
function App() {
	const boardRef = useRef();
	const [showOutput, setShowOutput] = useState(false);

	return (
		<div className="font-squada">
			<Header />
			<section className="split-screen-parent overflow-hidden">
				<SplitScreen split="vertical">
					<Board ref={boardRef} />
					<Editor />
				</SplitScreen>
			</section>
			<ActionBar onExport={() => setShowOutput(true)} />
			{showOutput && <Output onClose={() => setShowOutput(false)} />}
		</div>
	);
}

export default App;
