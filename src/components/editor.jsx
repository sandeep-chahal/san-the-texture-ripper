import React, { useRef, useEffect, useState } from "react";
import { useMainStore } from "../store";
import { useEditorStore } from "../store/editor";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import * as d3 from "d3";
import fx from "glfx";
import { uniqueId } from "../utils";
import DeleteSvg from "../components/svg/delete-svg";
import AddSvg from "../components/svg/add-svg";

const tempCanvas = document.createElement("canvas");
const tempCanvasCtx = tempCanvas.getContext("2d");

const Editor = () => {
	const isMouseOver = useRef(false);
	const wrapperRef = useRef(null);
	const parentRef = useRef(null);
	const [disabled, setDisabled] = useState(true);
	const svg = useRef(null);
	const canvas = useRef();
	const scale = useRef(1);
	const line = useRef(null);

	const { file, setResults, warpRealTime } = useMainStore();
	const {
		layers,
		totalLayerCount,
		activeLayer,
		setActiveLayer,
		glfxCanvas,
		texture,
	} = useEditorStore();

	const showImage = (data) => {
		const ctx = canvas.current.getContext("2d");
		ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
		canvas.current.width = data.width;
		canvas.current.height = data.height;
		ctx.drawImage(data, 0, 0);
		glfxCanvas.current = fx.canvas();
		texture.current = glfxCanvas.current.texture(data);
		glfxCanvas.current.draw(texture.current).update();

		if (!activeLayer) addLayer();
		drawCropBox();
	};

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
	}, [file]);
	useEffect(() => {
		const onKeyDown = (e) => {
			if (e.key === "c") {
				handleDeleteLayer(activeLayer);
			}
			if (e.key === "n") {
				addLayer();
			}
			if (e.keyCode === 17 && disabled && activeLayer) {
				setDisabled(false);
			}
			if ((isMouseOver.current && e.keyCode === 107) || e.keyCode === 187) {
				// console.log("zoom in");
				wrapperRef.current.zoomIn();
				scale.current += 0.5;
				drawCropBox();
			} else if (
				(isMouseOver.current && e.keyCode === 109) ||
				e.keyCode === 189
			) {
				// console.log("zoom out");
				wrapperRef.current.zoomOut();
				scale.current -= 0.5;
				drawCropBox();
			}
		};
		const onKeyUp = (e) => {
			if (e.keyCode === 17) {
				setDisabled(true);
			}
		};

		window.addEventListener("keydown", onKeyDown);
		window.addEventListener("keyup", onKeyUp);
		return () => {
			window.removeEventListener("keydown", onKeyDown);
			window.removeEventListener("keyup", onKeyUp);
		};
	}, [disabled, activeLayer]);

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
			points: [
				[radius * 2, radius * 2],
				[canvas.current.width - radius * 2, radius * 2],
				[canvas.current.width - radius * 2, canvas.current.height - radius * 2],
				[radius * 2, canvas.current.height - radius * 2],
			],
		};
	};

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
				parentRef.current.removeEventListener("mouseenter", onMouseEnter);
				parentRef.current.removeEventListener("mouseleave", onMouseLeave);
			}
		};
	}, []);

	useEffect(() => {
		drawCropBox();
	}, [activeLayer, warpRealTime]);

	const drawCropBox = () => {
		if (file === null || activeLayer == null || !layers.current[activeLayer])
			return;
		svg.current.selectAll("*").remove();
		const { radius, strokeWidth, opacity } = getSvgSize();
		line.current = svg.current
			.selectAll(".line")
			.data(new Array(10).fill(null))
			.enter()
			.append("path")
			.attr("class", "line")
			.attr("stroke-width", strokeWidth * 0.5)
			.attr("stroke-opacity", opacity)
			.attr("stroke", "#00ACED");

		svg.current
			.selectAll(".handle")
			.data(layers.current[activeLayer].points)
			.enter()
			.append("circle")
			.attr("class", `handle cursor-move`)
			.attr("fill", "transparent")
			.attr("stroke-width", strokeWidth * 0.8)
			.attr("stroke-opacity", opacity)
			.attr("r", radius)
			.attr("stroke", "#C27224")
			.attr("data-index", (d, i) => i)
			.attr("transform", function (d) {
				return "translate(" + d + ")";
			})
			.call(
				d3
					.drag()
					.on("drag", function (d) {
						if (
							d.x > 0 &&
							d.x < canvas.current.width &&
							d.y > 0 &&
							d.y < canvas.current.height
						) {
							d3.select(this).attr(
								"transform",
								"translate(" + d.x + "," + d.y + ")"
							);
							layers.current[activeLayer].points[
								d3.select(this).attr("data-index")
							] = [d.x, d.y];
							updatePerspectiveGrid();
							if (!warpRealTime) return;
							updateResultGLFX();
						}
					})
					.on("end", () => {
						updateResultGLFX();
					})
			);

		updatePerspectiveGrid();
		function updatePerspectiveGrid() {
			const points = layers.current[activeLayer].points;
			const verticalLines1 = getMidPointArray(points[0], points[3]);
			const verticalLines2 = getMidPointArray(points[1], points[2]);
			const horizontalLines1 = getMidPointArray(points[0], points[1]);
			const horizontalLines2 = getMidPointArray(points[3], points[2]);
			const linePoints1 = [...verticalLines1, ...horizontalLines1];
			const linePoints2 = [...verticalLines2, ...horizontalLines2];
			line.current._groups[0].forEach((line, index) => {
				line.setAttribute(
					"d",
					`M${linePoints1[index][0]},${linePoints1[index][1]}L${linePoints2[index][0]},${linePoints2[index][1]}`
				);
			});
		}

		function midPoint(x1, y1, x2, y2) {
			return [(x1 + x2) / 2, (y1 + y2) / 2];
		}

		function getMidPointArray(p1, p2) {
			const points = [];
			points.push(p1);
			points.push(p2);
			points.push(midPoint(p1[0], p1[1], p2[0], p2[1]));
			points.push(midPoint(p1[0], p1[1], points[2][0], points[2][1]));
			points.push(midPoint(p2[0], p2[1], points[2][0], points[2][1]));
			return points;
		}
	};

	const updateResultGLFX = () => {
		// opencv works better but its ~25MB :(
		if (!activeLayer || !layers.current[activeLayer]) return;
		let points = layers.current[activeLayer].points;
		let width = Math.max(
			points[1][0] - points[0][0],
			points[2][0] - points[3][0]
		);
		let height = Math.max(
			points[3][1] - points[0][1],
			points[2][1] - points[1][1]
		);
		if (width < 200 || height < 200) {
			let diff = Math.max(200 - width, 200 - height);
			width += diff;
			height += diff;
		}
		// algorithm works better when width and height same
		const fakeDim = Math.max(width, height);
		points = points.reduce((pV, cV) => [...pV, ...cV], []);
		const dstPoints = [0, 0, fakeDim, 0, fakeDim, fakeDim, 0, fakeDim];
		glfxCanvas.current
			.draw(texture.current)
			.perspective(points, dstPoints)
			.update();
		tempCanvas.width = fakeDim;
		tempCanvas.height = fakeDim;
		tempCanvasCtx.clearRect(0, 0, fakeDim, fakeDim);
		tempCanvasCtx.drawImage(
			glfxCanvas.current,
			0,
			0,
			fakeDim,
			fakeDim,
			0,
			0,
			fakeDim,
			fakeDim
		);

		// to remove transparency
		// get the data till the pixel is transparent on both axis
		let newWidth = null;
		let newHeight = null;
		for (let i = 0; i < fakeDim; i++) {
			const xPixelValue = tempCanvasCtx.getImageData(i, 0, 1, 1).data;
			if (
				xPixelValue[0] === 0 &&
				xPixelValue[1] === 0 &&
				xPixelValue[2] === 0 &&
				xPixelValue[3] === 0 &&
				newWidth === null
			) {
				newWidth = i;
			}
			const yPixelValue = tempCanvasCtx.getImageData(0, i, 1, 1).data;
			if (
				yPixelValue[0] === 0 &&
				yPixelValue[1] === 0 &&
				yPixelValue[2] === 0 &&
				yPixelValue[3] === 0 &&
				newHeight === null
			) {
				newHeight = i;
			}
		}

		if (newWidth != null || newHeight !== null) {
			newWidth = newWidth || fakeDim;
			newHeight = newHeight || fakeDim;

			const newPixelData = tempCanvasCtx.getImageData(
				0,
				0,
				newWidth,
				newHeight
			);
			tempCanvasCtx.clearRect(0, 0, fakeDim, fakeDim);
			tempCanvas.width = newWidth;
			tempCanvas.height = newHeight;
			tempCanvasCtx.putImageData(newPixelData, 0, 0);
		}

		setResults((state) => {
			const newState = { ...state };
			newState[activeLayer] = {
				result: tempCanvas.toDataURL(),
				width,
				height,
				id: activeLayer,
				name: layers.current[activeLayer].name,
			};
			return newState;
		});
	};
	const handleDeleteLayer = (id) => {
		const keys = Object.keys(layers.current);
		if (keys.length === 1) return;
		delete layers.current[id];
		setResults((state) => {
			const newState = { ...state };
			delete newState[id];
			return newState;
		});
		if (activeLayer === id) {
			setActiveLayer(keys[0]);
		}
	};

	const lerp = (x, y, a) => x * (1 - a) + y * a;

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

	return (
		<div
			className={`h-full dot-pattern ${
				disabled ? "cursor-default" : "cursor-grab"
			}`}
			ref={parentRef}
			// onKeyPress={console.log}
		>
			{Object.keys(layers.current).length ? (
				<div className="p-1 px-2 flex items-start text-primary2">
					<div className="flex overflow-x-auto scroll-bar-1">
						{Object.keys(layers.current).map((key, index) => (
							<div
								key={key}
								className={`px-3 group min-w-max relative ${
									activeLayer === key ? "border-b-2 border-primary1" : ""
								}`}
							>
								<span
									className="cursor-pointer"
									onClick={() => setActiveLayer(key)}
								>
									{layers.current[key].name}
								</span>
								{/* delete icon */}
								<div
									title="Delete Layer (C)"
									className="inline-block opacity-0 group-hover:opacity-100"
									onClick={() => handleDeleteLayer(key)}
								>
									<DeleteSvg />
								</div>
							</div>
						))}
					</div>
					{/* add icon */}
					<div
						onClick={addLayer}
						className="mt-1 flex items-center ml-2 transition-transform transform rotate-0 hover:rotate-90 hover:scale-110"
					>
						<AddSvg />
					</div>
				</div>
			) : null}

			<TransformWrapper
				ref={wrapperRef}
				scale={scale.current}
				minScale={0.1}
				limitToBounds={false}
				disabled={disabled}
				onZoomStop={(ref) => {}}
				onZoom={(ref) => {
					scale.current = ref.state.scale;
					drawCropBox();
				}}
			>
				<TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
					<div>
						<canvas ref={canvas}></canvas>
						<svg id="svg" className="absolute top-0 left-0 w-full h-full">
							<g
								ref={(ref) => {
									svg.current = d3.select(ref);
								}}
							></g>
						</svg>
					</div>
				</TransformComponent>
			</TransformWrapper>
		</div>
	);
};
export default Editor;
