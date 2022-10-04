import React from "react";
import { getNewLayer } from "../utils/editor";
import { useMainStore } from "../store";
import { useEditorStore } from "../store/editor";
import AddSvg from "./svg/add-svg";
import CloseSvg from "./svg/close-svg";
import LayersSvg from "./svg/layers-svg";

const Sidebar = () => {
	const {
		editorSettings,
		layers, // layers object
		totalLayerCount, //total number of layers
		activeLayer, // current active layer id
		setActiveLayer,
		opencvImg, // opencv image
	} = useEditorStore();
	const { file, setResults, warpRealTime, openCV } = useMainStore();

	const tabs = Object.values(layers.current).map((tab) => ({
		name: tab.name,
		key: tab.id,
	}));

	// delete layer
	const handleDeleteLayer = (id) => {
		const keys = Object.keys(layers.current);

		// if there's only one layer then don't delete
		if (keys.length === 1) return;

		delete layers.current[id];
		setResults((state) => {
			const newState = { ...state };
			delete newState[id];
			return newState;
		});
		// if user deleted active layer then set active layer to first layer
		// or to second if first layer is deleted
		if (activeLayer === id) {
			setActiveLayer(keys[keys[0] === id ? 1 : 0]);
		}
	};

	const handleAddLayer = () => {
		const newLayer = getNewLayer(file, totalLayerCount, editorSettings);
		layers.current[newLayer.id] = newLayer;
		setActiveLayer(newLayer.id);
	};

	return (
		<div className="bg-gray-800 text-gray-200 w-48 h-screen flex flex-col absolute right-0 top-0 border-l-2 border-primary1">
			<div className="flex-1 overflow-y-auto">
				{/* header */}
				<div className="text-2xl px-2 pt-2 text-primary2 font-bold flex items-center justify-between">
					<h3>Layers</h3>
					<AddSvg addLayer={handleAddLayer} />
				</div>
				<nav className="mt-2">
					{opencvImg.current ? (
						tabs.map((tab) => (
							<a
								key={tab.key}
								className={`${
									tab.key === activeLayer
										? "bg-gray-900 "
										: "text-gray-300 hover:bg-gray-700 "
								} group cursor-pointer text-primary2 flex justify-between items-center px-2 text-sm font-medium rounded-md`}
							>
								<div
									className="w-full py-2 flex items-center"
									onClick={() => setActiveLayer(tab.key)}
								>
									<LayersSvg />
									<h4 className="truncate ml-1">
										{tab.name}
									</h4>
								</div>
								<div
									title="close"
									className="opacity-0 group-hover:opacity-100"
									onClick={() => handleDeleteLayer(tab.key)}
								>
									<CloseSvg />
								</div>
							</a>
						))
					) : (
						<div className=" px-2 text-sm text-center text-primary2 opacity-30 mt-2">
							<p>Import an image to start editing</p>
						</div>
					)}
				</nav>
			</div>
		</div>
	);
};

export default Sidebar;
