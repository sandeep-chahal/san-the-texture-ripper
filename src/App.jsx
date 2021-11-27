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
			<Header onExport={() => setShowOutput(true)} />
			<section className="split-screen-parent overflow-hidden">
				<SplitScreen split="vertical">
					<Board ref={boardRef} />
					<Editor />
				</SplitScreen>
			</section>
			{showOutput && <Output onClose={() => setShowOutput(false)} />}
		</div>
	);
}

export default App;
