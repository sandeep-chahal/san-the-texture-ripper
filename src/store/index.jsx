import { createContext, useContext, useState, useEffect } from "react";

export const context = createContext();

export default ({ children }) => {
	const [file, setFile] = useState(null);
	const [warpRealTime, setWarpRealTime] = useState(false);
	const [results, setResults] = useState({});
	return (
		<context.Provider
			value={{
				file,
				setFile,
				results,
				setResults,
				warpRealTime,
				setWarpRealTime,
			}}
		>
			{children}
		</context.Provider>
	);
};

export const useStore = () => {
	const store = useContext(context);
	return store;
};
