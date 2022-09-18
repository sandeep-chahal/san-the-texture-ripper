import React, { useRef, useEffect, useState, useMemo } from "react";
import { useMainStore } from "../store";
import { useEditorStore } from "../store/editor";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Tabs from "./tabs";
import { Stage, Layer, Rect, Circle, Image, Text, Line } from "react-konva";
import {
	getMeshLinesPositions,
	getNewLayer,
	showImage,
	updateResultOpencv,
} from "../utils/editor";

const Editor = () => {
	const [disabled, setDisabled] = useState(false); // if panning and zooming is disabled / ctrl key is pressed or not
	const scale = useRef(1); // zoom scale
	const circleRef = useRef([
		{ ref: null }, // TL
		{ ref: null }, // TR
		{ ref: null }, // BR
		{ ref: null }, // BL
	]);
	const cornerLinesRef = useRef(null);
	const meshLinesRef = useRef([
		{
			ref: null,
		},
		{
			ref: null,
		},
		{
			ref: null,
		},
		{
			ref: null,
		},
		{
			ref: null,
		},
		{
			ref: null,
		},
	]);

	const { file, setResults, warpRealTime, openCV } = useMainStore();
	const {
		editorSettings,
		layers, // layers object
		totalLayerCount, //total number of layers
		activeLayer, // current active layer id
		setActiveLayer,
		opencvImg, // opencv image
	} = useEditorStore();

	// ---------------------------------------------------------------------------

	useEffect(() => {
		// when new file is imported or opencv library is ready
		if (!file || !openCV.cv) return;
		showImage(file, opencvImg, activeLayer, handleAddLayer);
	}, [file, openCV.cv]);

	useEffect(() => {
		if (!activeLayer) return;
		updateCornerLinesPositions();
		updateMeshLinesPositions();
	}, [activeLayer]);

	const handleAddLayer = () => {
		const newLayer = getNewLayer(file, totalLayerCount, editorSettings);
		layers.current[newLayer.id] = newLayer;
		setActiveLayer(newLayer.id);
	};

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

	const handleOnDragEnd = () => {
		updateResultOpencv(activeLayer, layers, opencvImg, setResults);
	};

	const handleOnDrag = (e, index) => {
		layers.current[activeLayer].points[index].x = e.target.x();
		layers.current[activeLayer].points[index].y = e.target.y();
		updateCornerLinesPositions();
		updateMeshLinesPositions();
	};

	const updateMeshLinesPositions = () => {
		const meshPoints = getMeshLinesPositions(
			layers.current[activeLayer].points
		);
		meshPoints.forEach((point, index) => {
			meshLinesRef.current[index].ref.points(point);
		});
	};

	const updateCornerLinesPositions = () => {
		cornerLinesRef.current.points(getLinePoints());
	};

	const getLinePoints = () => {
		return [
			layers.current[activeLayer].points[0].x,
			layers.current[activeLayer].points[0].y,
			layers.current[activeLayer].points[3].x,
			layers.current[activeLayer].points[3].y,
			layers.current[activeLayer].points[2].x,
			layers.current[activeLayer].points[2].y,
			layers.current[activeLayer].points[1].x,
			layers.current[activeLayer].points[1].y,
			layers.current[activeLayer].points[0].x,
			layers.current[activeLayer].points[0].y,
		];
	};

	return (
		<div className={`h-full dot-pattern`}>
			<Tabs
				tabs={Object.values(layers.current).map((tab) => ({
					name: tab.name,
					key: tab.id,
				}))}
				handleDeleteTab={handleDeleteLayer}
				activeTab={activeLayer}
				setActiveTab={setActiveLayer}
				addTab={handleAddLayer}
			/>

			{/* pan and zoom components */}
			<TransformWrapper
				scale={scale.current}
				minScale={0.1}
				limitToBounds={false}
				disabled={disabled}
				onZoomStop={(ref) => {}}
				onZoom={(ref) => {
					scale.current = ref.state.scale;
				}}
				onPanningStart={(ref, e) => {
					// don't pan if using left click without ctrl key
					// and pan if using other mouse button (e.g middle button, right button)
					if (e.which === 1 && !e.ctrlKey) setDisabled(true);
					else setDisabled(false);
				}}
				onPanningStop={(ref) => setDisabled(false)}
			>
				<TransformComponent
					wrapperStyle={{ width: "100%", height: "100%" }}
				>
					{file && activeLayer ? (
						<Stage width={file.width} height={file.height}>
							<Layer>
								<Image
									image={file}
									width={file.width}
									height={file.height}
								/>
							</Layer>
							{/* four draggable circles and lines*/}
							<Layer>
								<Line
									ref={cornerLinesRef}
									stroke={editorSettings.lineColor}
									strokeWidth={editorSettings.lineWidth}
									points={getLinePoints()}
								/>

								{meshLinesRef.current.map((line, index) => (
									<Line
										key={index}
										stroke={editorSettings.lineColor}
										strokeWidth={editorSettings.lineWidth}
										ref={(ref) => {
											line.ref = ref;
										}}
										points={
											getMeshLinesPositions(
												layers.current[activeLayer]
													.points
											)[index]
										}
									/>
								))}

								{layers.current[activeLayer]?.points?.map(
									(point, index) => (
										<Circle
											key={index}
											x={point.x}
											y={point.y}
											ref={(ref) => {
												if (ref)
													circleRef.current[
														index
													].ref = ref;
											}}
											radius={editorSettings.radius}
											stroke={editorSettings.strokeColor}
											strokeWidth={
												editorSettings.strokeWidth
											}
											onDragEnd={handleOnDragEnd}
											draggable
											onDragMove={(e) =>
												handleOnDrag(e, index)
											}
										/>
									)
								)}
							</Layer>
						</Stage>
					) : null}
				</TransformComponent>
			</TransformWrapper>
		</div>
	);
};
export default Editor;
