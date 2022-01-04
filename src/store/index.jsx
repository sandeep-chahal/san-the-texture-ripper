import { createContext, useContext, useState, useEffect } from "react";
import { LoadOpenCV, gg } from "../utils/loadOpenCV";

export const context = createContext();

export default ({ children }) => {
	const [file, setFile] = useState(null);
	const [warpRealTime, setWarpRealTime] = useState(false);
	const [showWhatsNew, setShowWhatsNew] = useState(false);
	const [newUpdate, setNewUpdate] = useState(false);
	const [results, setResults] = useState({});
	const [warpLibrary, setWarpLibrary] = useState("glfx");
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

			LoadOpenCV((cv) => {
				localStorage.setItem("opencv_loaded", true);
				setOpenCV({
					state: "loaded",
					cv: cv,
				});
				console.log("OpenCV loaded");
			});
		} else {
			console.log("OpenCV already loaded");
		}
	};

	const changeWarpLibrary = (library) => {
		localStorage.setItem("warp_library", library);
		if (library) setWarpLibrary(library);
		if (library === "opencv") handleLoadOpenCV();
	};

	useEffect(() => {
		// last selected library
		const library = localStorage.getItem("warp_library");
		if (library === "glfx" || library === "opencv") setWarpLibrary(library);
		const openCVLoaded = JSON.parse(localStorage.getItem("opencv_loaded"));
		if (openCVLoaded || library === "opencv") {
			handleLoadOpenCV();
		}

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
				warpLibrary,
				setWarpLibrary: changeWarpLibrary,
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
