import { createContext, useContext, useState, useEffect } from "react";
import { LoadOpenCV } from "../utils/loadOpenCV";

export const context = createContext();

export default ({ children }) => {
	const [file, setFile] = useState(null);
	const [warpRealTime, setWarpRealTime] = useState(false);
	const [showWhatsNew, setShowWhatsNew] = useState(false);
	const [newUpdate, setNewUpdate] = useState(false);
	const [results, setResults] = useState({});
	const [openCV, setOpenCV] = useState({
		state: "not_loaded",
		cv: null,
	});

	const handleLoadOpenCV = () => {
		if (openCV.state === "not_loaded") {
			setOpenCV({
				state: "loading",
				cv: null,
			});

			LoadOpenCV(
				// when open cv loaded
				(cv) => {
					localStorage.setItem("opencv_loaded", true);
					setOpenCV({
						state: "loaded",
						cv: cv,
					});
					console.log("OpenCV loaded");
				},
				(err) => {
					// on error
					console.log("Couldn't load opencv");
					localStorage.setItem("warp_library", "glfx");
					localStorage.setItem("opencv_loaded", false);
					setOpenCV({
						state: "not_loaded",
						cv: null,
					});
					alert("Couldn't load opencv");
				}
			);
		} else {
			console.log("OpenCV already loaded");
		}
	};

	useEffect(() => {
		handleLoadOpenCV();

		// show whats new if the user has not seen it before
		const lastUpdate = localStorage.getItem("lastUpdate");
		if (lastUpdate !== import.meta.env.VITE_LAST_UPDATE) {
			setNewUpdate(true);
		}
	}, []);
	return (
		<context.Provider
			value={{
				file,
				setFile,
				results,
				setResults,
				showWhatsNew,
				setShowWhatsNew,
				warpRealTime,
				setWarpRealTime,

				newUpdate,
				setNewUpdate,
				openCV,
				setOpenCV,
			}}
		>
			{children}
		</context.Provider>
	);
};

export const useMainStore = () => {
	const store = useContext(context);
	return store;
};
