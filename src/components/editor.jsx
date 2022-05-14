import React, { useRef, useEffect, useState } from "react";
import { useMainStore } from "../store";
import { useEditorStore } from "../store/editor";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { uniqueId } from "../utils";
import CropBox from "./cropbox";
import Tabs from "./tabs";

const tempCanvas = document.createElement("canvas");
const tempCanvasCtx = tempCanvas.getContext("2d");

const Editor = () => {
	const isMouseOver = useRef(false); // if mouse is over editor
	const wrapperRef = useRef(null); // transform wrapper(zoom, pan, pinch)
	const parentRef = useRef(null); // parent/container div
	const [disabled, setDisabled] = useState(false); // if panning and zooming is disabled / ctrl key is pressed or not
	const canvas = useRef(); // canvas
	const scale = useRef(1); // zoom scale
	const cropBox = useRef(null);

	const { file, setResults, warpRealTime, openCV } = useMainStore();
	const {
		layers, // layers object
		totalLayerCount, //total number of layers
		activeLayer, // current active layer id
		setActiveLayer,
		opencvImg, // opencv image
	} = useEditorStore();

	// draw newly imported image on canvas
	const showImage = (data) => {
		const ctx = canvas.current.getContext("2d");
		ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
		canvas.current.width = data.width;
		canvas.current.height = data.height;
		ctx.drawImage(data, 0, 0);
		if (window.cv) {
			opencvImg.current = window.cv.imread(canvas.current);
		}
		if (!activeLayer) addLayer();
		if (cropBox.current) cropBox.current.drawCropBox();
	};

	// when new file is imported
	useEffect(() => {
		if (canvas.current && file) {
			// if file is base64
			if (typeof file === "string") {
				const img = new Image();
				img.src = file;
				img.onload = () => showImage(img);
			}
			// if file is bitmap
			else if (typeof file === "object") {
				showImage(file);
			}
		}
	}, [file, openCV.cv]);

	// handle key events
	useEffect(() => {
		const onKeyDown = (e) => {
			if (
				(isMouseOver.current && e.keyCode === 107) ||
				e.keyCode === 187
			) {
				// console.log("zoom in");
				wrapperRef.current.zoomIn();
				scale.current += 0.5;
				if (cropBox.current) cropBox.current.drawCropBox();
			} else if (
				(isMouseOver.current && e.keyCode === 109) ||
				e.keyCode === 189
			) {
				// console.log("zoom out");
				wrapperRef.current.zoomOut();
				scale.current -= 0.5;
				if (cropBox.current) cropBox.current.drawCropBox();
			}
		};

		window.addEventListener("keydown", onKeyDown);
		return () => {
			window.removeEventListener("keydown", onKeyDown);
		};
	}, [disabled, activeLayer]);

	// add new layer
	const addLayer = () => {
		const newLayer = getDefaultLayerConfig();
		layers.current[newLayer.id] = newLayer;
		setActiveLayer(newLayer.id);
	};

	const getDefaultLayerConfig = () => {
		const { radius } = getSvgSize();
		return {
			name: `Layer ${++totalLayerCount.current}`,
			id: uniqueId(),
			// points -> where new cropbox handles(svg circles) will be drawn initially
			points: [
				[radius * 2, radius * 2],
				[canvas.current.width - radius * 2, radius * 2],
				[
					canvas.current.width - radius * 2,
					canvas.current.height - radius * 2,
				],
				[radius * 2, canvas.current.height - radius * 2],
			],
		};
	};

	// mouse events
	useEffect(() => {
		const onMouseEnter = () => {
			isMouseOver.current = true;
		};
		const onMouseLeave = () => {
			isMouseOver.current = false;
		};
		if (parentRef.current) {
			parentRef.current.addEventListener("mouseenter", onMouseEnter);
			parentRef.current.addEventListener("mouseleave", onMouseLeave);
		}
		return () => {
			if (parentRef.current) {
				parentRef.current.removeEventListener(
					"mouseenter",
					onMouseEnter
				);
				parentRef.current.removeEventListener(
					"mouseleave",
					onMouseLeave
				);
			}
		};
	}, []);

	useEffect(() => {
		if (cropBox.current) cropBox.current.drawCropBox();
	}, [activeLayer, warpRealTime]);

	// delete layer
	const handleDeleteLayer = (id) => {
		const keys = Object.keys(layers.current);

		// if there's only one layer then dont delete
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

	const lerp = (x, y, a) => x * (1 - a) + y * a;

	// calculate handle(circle) radius and lines width based on canvas size and zoom
	const getSvgSize = () => {
		const rMinSize = 2;
		const rMaxSize = 20;
		const size = Math.min(canvas.current.width, canvas.current.height);
		let radius = size / 45;
		radius = Math.max(rMinSize, Math.min(rMaxSize, radius));
		if (size * scale.current > 4000) radius *= 0.15;
		else if (size * scale.current > 2000) radius *= 0.3;
		else if (size * scale.current > 800) radius *= 0.5;
		else if (size * scale.current > 500) radius *= 0.8;
		const opacity = Math.max(lerp(0.6, 1, 1 - scale.current + 1), 0.6);
		return { radius, strokeWidth: radius / 2, opacity };
	};

	const updateResultOpencv = () => {
		// http://www.recompile.in/2019/11/image-perspective-correction-using.html
		if (!activeLayer || !layers.current[activeLayer]) return;
		if (openCV.state !== "loaded") {
			alert(
				openCV.state === "loading"
					? "opencv is not loaded"
					: "opencv is not ready yet"
			);
			return;
		}
		const cv = window.cv;

		let points = layers.current[activeLayer].points;

		let width = Math.max(
			points[1][0] - points[0][0],
			points[2][0] - points[3][0]
		);
		let height = Math.max(
			points[3][1] - points[0][1],
			points[2][1] - points[1][1]
		);
		// min height and width must be 200px
		if (width < 200 || height < 200) {
			let diff = Math.max(200 - width, 200 - height);
			width += diff;
			height += diff;
		}
		// flatten the array
		points = points.reduce((pV, cV) => [...pV, ...cV], []);
		const dstPoints = [0, 0, height, 0, height, width, 0, width];

		let dst = new cv.Mat();
		let dsize = new cv.Size(height, width);
		let srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, points);
		let dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, dstPoints);
		let M = cv.getPerspectiveTransform(srcTri, dstTri);
		cv.warpPerspective(
			opencvImg.current,
			dst,
			M,
			dsize,
			cv.INTER_LINEAR,
			cv.BORDER_CONSTANT,
			new cv.Scalar()
		);

		// get the image data from opencv canvas
		tempCanvas.width = dsize.width;
		tempCanvas.height = dsize.height;
		cv.imshow(tempCanvas, dst);
		const base64 = tempCanvas.toDataURL();

		// update results
		setResults((state) => {
			const newState = { ...state };
			newState[activeLayer] = {
				result: base64,
				width,
				height,
				id: activeLayer,
				name: layers.current[activeLayer].name,
			};
			return newState;
		});

		// cleanup
		dst.delete();
		M.delete();
		srcTri.delete();
		dstTri.delete();
	};

	return (
		<div className={`h-full dot-pattern`} ref={parentRef}>
			<Tabs
				tabs={Object.values(layers.current).map((tab) => ({
					name: tab.name,
					key: tab.id,
				}))}
				handleDeleteTab={handleDeleteLayer}
				activeTab={activeLayer}
				setActiveTab={setActiveLayer}
				addTab={addLayer}
			/>

			{/* pan and zoom components */}
			<TransformWrapper
				ref={wrapperRef}
				scale={scale.current}
				minScale={0.1}
				limitToBounds={false}
				disabled={disabled}
				onZoomStop={(ref) => {}}
				onZoom={(ref) => {
					scale.current = ref.state.scale;
					if (cropBox.current) cropBox.current.drawCropBox();
				}}
				onPanningStart={(ref, e) => {
					// dont pan if using left click without ctrl key
					// and pan if using other mouse button (e.g middle button, right button)
					if (e.which === 1 && !e.ctrlKey) setDisabled(true);
					else setDisabled(false);
				}}
				onPanningStop={(ref) => {
					setDisabled(false);
				}}
			>
				<TransformComponent
					wrapperStyle={{ width: "100%", height: "100%" }}
				>
					<div>
						{/* actual canvas */}
						<canvas ref={canvas}></canvas>
						<CropBox
							canvas={canvas}
							layers={layers}
							updateResults={updateResultOpencv}
							ref={cropBox}
							file={file}
							activeLayer={activeLayer}
							getSvgSize={getSvgSize}
							warpRealTime={warpRealTime}
						/>
					</div>
				</TransformComponent>
			</TransformWrapper>
		</div>
	);
};
export default Editor;
