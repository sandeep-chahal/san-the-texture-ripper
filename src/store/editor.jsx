import { createContext, useContext, useState, useEffect, useRef } from "react";

export const editorContext = createContext();

const EditorStore = ({ children }) => {
	const [editorSettings, setEditorSettings] = useState({
		radius: 8,
		strokeWidth: 4,
		strokeColor: "#000",
		lineColor: "#000",
		lineWidth: 2,
	});
	const layers = useRef({});
	const totalLayerCount = useRef(0);
	const [activeLayer, setActiveLayer] = useState(null);

	const opencvImg = useRef(null);

	return (
		<editorContext.Provider
			value={{
				layers,
				totalLayerCount,
				activeLayer,
				setActiveLayer,
				opencvImg,
				editorSettings,
				setEditorSettings,
			}}
		>
			{children}
		</editorContext.Provider>
	);
};

export default EditorStore;

export const useEditorStore = () => {
	const store = useContext(editorContext);
	return store;
};
