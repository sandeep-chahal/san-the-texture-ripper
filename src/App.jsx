import React, { useState, useEffect } from "react";
import ReactGA from "react-ga";
import { FileDrop } from "react-file-drop";
import Header from "./components/header";
import SplitScreen from "./components/split-screen";
import Editor from "./components/editor";
import Board from "./components/board";
import Output from "./components/output";
import { handleFileChange, readFileFromClipboard } from "./utils/file";
import { useMainStore } from "./store";
import { useEditorStore } from "./store/editor";
import WhatsNew from "./components/whats-new";
import useWindowSize from "./hooks/useWinSize";
import Tabs from "./components/tabs";
import Sidebar from "./components/sidebar";

function App() {
	const [showOutput, setShowOutput] = useState(false);
	const [dropping, setDropping] = useState(false);
	const { setFile, showWhatsNew, newUpdate, setNewUpdate } = useMainStore();
	const { layers, setActiveLayer, totalLayerCount } = useEditorStore();
	const { width, height } = useWindowSize();
	const [splitType, setSplitType] = useState("vertical");

	useEffect(() => {
		if (width < 800 && splitType === "vertical") {
			setSplitType("horizontal");
		}
		if (width > 800 && splitType === "horizontal") {
			setSplitType("vertical");
		}
	}, [width]);

	const setNewFile = (file) => {
		// reset old layers
		layers.current = {};
		totalLayerCount.current = 0;
		setActiveLayer(null);
		// set new file
		setFile(file);
	};

	const onFileDrop = (event) => {
		setDropping(false);
		const file = event.dataTransfer.files[0];
		if (file) {
			handleFileChange(file, setNewFile);
		}
	};
	const onFileChange = (file, clearInput) => {
		handleFileChange(file, setNewFile, clearInput);
	};

	useEffect(() => {
		ReactGA.initialize(import.meta.env.VITE_TRACKING_ID);
		ReactGA.pageview("/");
		// copy paste image
		document.onpaste = (e) => readFileFromClipboard(e, setNewFile);
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
				handleFileChange={onFileChange}
				newUpdate={newUpdate}
				setNewUpdate={setNewUpdate}
			/>
			<FileDrop
				onFrameDragEnter={(event) => setDropping(true)}
				onFrameDragLeave={(event) => setDropping(false)}
				onFrameDrop={onFileDrop}
			>
				<section
					className={`relative split-screen-parent overflow-hidden ${
						dropping ? "opacity-90" : ""
					}`}
				>
					<SplitScreen type={splitType} width={width} height={height}>
						<Board />
						<Editor />
					</SplitScreen>
					<Sidebar />
				</section>
			</FileDrop>
			{showOutput && <Output onClose={() => setShowOutput(false)} />}
			{showWhatsNew && <WhatsNew />}
		</div>
	);
}

export default App;
