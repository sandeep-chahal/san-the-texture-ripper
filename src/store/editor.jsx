import { createContext, useContext, useState, useEffect, useRef } from "react";

export const editorContext = createContext();

const EditorStore = ({ children }) => {
	const layers = useRef({});
	const totalLayerCount = useRef(0);
	const [activeLayer, setActiveLayer] = useState(null);
	const glfxCanvas = useRef(null);
	const texture = useRef(null);
	const opencvImg = useRef(null);

	return (
		<editorContext.Provider
			value={{
				layers,
				totalLayerCount,
				activeLayer,
				setActiveLayer,
				glfxCanvas,
				texture,
				opencvImg,
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
