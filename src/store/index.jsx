import { createContext, useContext, useState, useEffect } from "react";

export const context = createContext();

export default ({ children }) => {
	const [file, setFile] = useState(null);
	const [warpRealTime, setWarpRealTime] = useState(false);
	const [showWhatsNew, setShowWhatsNew] = useState(false);
	const [results, setResults] = useState({});

	// show whats new if the user has not seen it before
	useEffect(() => {
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
