import React, { useState, useEffect } from "react";
import ReactGA from "react-ga";
import { FileDrop } from "react-file-drop";
import Header from "./components/header";
import SplitScreen from "./components/split-screen";
import Editor from "./components/editor";
import Board from "./components/board";
import Output from "./components/output";
import { readImage } from "./utils";
import { useStore } from "./store";

const IMAGE_FORMATS = ["image/png", "image/jpg", "image/jpeg", "image/webp"];

function App() {
	const [showOutput, setShowOutput] = useState(false);
	const [droping, setDroping] = useState(false);
	const { setFile } = useStore();
	useEffect(() => {
		ReactGA.initialize(import.meta.env.VITE_TRACKING_ID);
		ReactGA.pageview("/");
	}, []);

	const handleFileChange = async (file, cb) => {
		try {
			if (IMAGE_FORMATS.includes(file.type)) {
				const base64File = await readImage(file);
				setFile(base64File);
			} else {
				console.log("FILE TYPE NOT SUPPORTED", file.type);
			}
			// clear the file input
			if (cb) cb();
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className="font-squada animate-opacity">
			<Header
				onExport={() => setShowOutput(true)}
				handleFileChange={handleFileChange}
			/>
			<FileDrop
				onFrameDragEnter={(event) => {
					setDroping(true);
				}}
				onFrameDragLeave={(event) => setDroping(false)}
				onFrameDrop={(event) => {
					setDroping(false);
					const file = event.dataTransfer.files[0];
					if (file && IMAGE_FORMATS.includes(file.type)) {
						handleFileChange(file);
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
		</div>
	);
}

export default App;
