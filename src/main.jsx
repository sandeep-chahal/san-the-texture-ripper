import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import MainStore from "./store";
import EditorStore from "./store/editor";

ReactDOM.render(
	<React.StrictMode>
		<MainStore>
			<EditorStore>
				<App />
			</EditorStore>
		</MainStore>
	</React.StrictMode>,
	document.getElementById("root")
);
