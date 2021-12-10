import React from "react";
import ReactDOM from "react-dom";
import ReactGA from "react-ga";
import "./index.css";
import App from "./App";
import Store from "./store";

ReactDOM.render(
	<React.StrictMode>
		<Store>
			<App />
		</Store>
	</React.StrictMode>,
	document.getElementById("root")
);

ReactGA.initialize(import.meta.env.VITE_TRACKING_ID);
ReactGA.pageview(window.location.pathname + window.location.search);
