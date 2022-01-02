import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import MainStore from "./store";
import EditorStore from "./store/editor";
import { OpenCvProvider } from "opencv-react";

ReactDOM.render(
	<React.StrictMode>
		<MainStore>
			<EditorStore>
				<OpenCvProvider openCvPath="opencv.js">
					<App />
				</OpenCvProvider>
			</EditorStore>
		</MainStore>
	</React.StrictMode>,
	document.getElementById("root")
);
