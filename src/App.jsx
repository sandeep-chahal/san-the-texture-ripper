import React, { useState, useEffect } from "react";
import ReactGA from "react-ga";
import { FileDrop } from "react-file-drop";
import Header from "./components/header";
import SplitScreen from "./components/split-screen";
import Editor from "./components/editor";
import Board from "./components/board";
import Output from "./components/output";
import { handleFileChange, readFileFromClipboard } from "./utils/file";
import { useStore } from "./store";
import WhatsNew from "./components/whats-new";

function App() {
	const [showOutput, setShowOutput] = useState(false);
	const [droping, setDroping] = useState(false);
	const { setFile, showWhatsNew } = useStore();
	useEffect(() => {
		ReactGA.initialize(import.meta.env.VITE_TRACKING_ID);
		ReactGA.pageview("/");
		// copy paste image
		document.onpaste = (e) => readFileFromClipboard(e, setFile);
	}, []);

	useEffect(() => {
		if (showOutput) return;
		const preventContextMenu = (e) => {
			e.preventDefault();
		};
		document.addEventListener("contextmenu", preventContextMenu);
		return () => {
			document.removeEventListener("contextmenu", preventContextMenu);
		};
	}, [showOutput]);

	return (
		<div className="font-squada animate-opacity">
			<Header
				onExport={() => setShowOutput(true)}
				handleFileChange={(file, clearInput) =>
					handleFileChange(file, setFile, clearInput)
				}
			/>
			<FileDrop
				onFrameDragEnter={(event) => {
					setDroping(true);
				}}
				onFrameDragLeave={(event) => setDroping(false)}
				onFrameDrop={(event) => {
					setDroping(false);
					const file = event.dataTransfer.files[0];
					if (file) {
						handleFileChange(file, setFile);
					}
				}}
			>
				<section
					className={`split-screen-parent overflow-hidden ${
						droping ? "opacity-90" : ""
					}`}
				>
					<SplitScreen split="vertical">
						<Board />
						<Editor />
					</SplitScreen>
				</section>
			</FileDrop>
			{showOutput && <Output onClose={() => setShowOutput(false)} />}
			{showWhatsNew && <WhatsNew />}
		</div>
	);
}

export default App;
