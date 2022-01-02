import { createContext, useContext, useState, useEffect } from "react";

export const context = createContext();

export default ({ children }) => {
	const [file, setFile] = useState(null);
	const [warpRealTime, setWarpRealTime] = useState(false);
	const [showWhatsNew, setShowWhatsNew] = useState(false);
	const [results, setResults] = useState({});
	const [warpLibrary, changeWarpLibrary] = useState("glfx");

	const setWarpLibrary = (library) => {
		localStorage.setItem("warp_library", library);
		changeWarpLibrary(library);
	};

	useEffect(() => {
		// last selected library
		const library = localStorage.getItem("warp_library");
		if (library === "glfx" || library === "opencv") changeWarpLibrary(library);

		// show whats new if the user has not seen it before
		const lastUpdate = localStorage.getItem("lastUpdate");
		if (lastUpdate !== import.meta.env.VITE_LAST_UPDATE) {
			setShowWhatsNew(true);
			localStorage.setItem("lastUpdate", import.meta.env.VITE_LAST_UPDATE);
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
				setWarpLibrary,
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
