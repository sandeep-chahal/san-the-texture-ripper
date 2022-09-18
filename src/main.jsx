import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import MainStore from "./store";
import EditorStore from "./store/editor";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
	<React.StrictMode>
		<MainStore>
			<EditorStore>
				<App />
			</EditorStore>
		</MainStore>
	</React.StrictMode>
);
