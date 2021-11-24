import React, { useCallback, useRef } from "react";
import Header from "./components/header";
import SplitScreen from "./components/split-screen";
import ActionBar from "./components/action-bar";
import Editor from "./components/editor";
import Board from "./components/board";
function App() {
	const boardRef = useRef();
	const editorRef = useRef();

	return (
		<div className="font-squada">
			<Header />
			<section className="split-screen-parent overflow-hidden">
				<SplitScreen split="vertical">
					<Board ref={boardRef} />
					<Editor ref={editorRef} />
				</SplitScreen>
			</section>
			<ActionBar
				onExport={() => boardRef.current.handleExport()}
				warp={() => editorRef.current.warp()}
			/>
		</div>
	);
}

export default App;
