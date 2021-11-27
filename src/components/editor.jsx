import React, { useRef, useEffect, useState } from "react";
import { useStore } from "../store";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import * as d3 from "d3";
import fx from "glfx";
import { uniqueId } from "../utils";

const tempCanvas = document.createElement("canvas");
const tempCanvasCtx = tempCanvas.getContext("2d");

const Editor = (props) => {
	const svg = useRef(null);
	const [disabled, setDisabled] = useState(true);
	const canvas = useRef();
	const scale = useRef(1);
	const line = useRef(null);
	const { file, setResults, warpRealTime } = useStore();
	const layers = useRef({});
	const totalLayerCount = useRef(0);
	const [activeLayer, setActiveLayer] = useState(null);
	const glfxCanvas = useRef(null);
	const texture = useRef(null);

	useEffect(() => {
		if (file && canvas.current) {
			console.log("got new image");
			const img = new Image();
			img.src = file;
			img.onload = () => {
				console.log("read new Image");
				const ctx = canvas.current.getContext("2d");
				ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
				canvas.current.width = img.width;
				canvas.current.height = img.height;
				ctx.drawImage(img, 0, 0);
				glfxCanvas.current = fx.canvas();
				texture.current = glfxCanvas.current.texture(img);
				layers.current = {};
				addLayer();
				drawCropBox();
			};
		} else {
			// reset everything
			canvas.current
				.getContext("2d")
				.clearRect(0, 0, canvas.current.width, canvas.current.height);
			canvas.current.width = 0;
			canvas.current.height = 0;
			glfxCanvas.current = null;
			texture.current = null;
			layers.current = {};
			line.current = null;
			totalLayerCount.current = 0;
			setActiveLayer(null);
			setDisabled(true);
			setResults({});
		}
	}, [file]);
	useEffect(() => {
		const onKeyDown = (e) => {
			if (e.keyCode === 17 && disabled && activeLayer) {
				setDisabled(false);
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
		drawCropBox();
	}, [file, activeLayer, warpRealTime]);

	const drawCropBox = () => {
		if (file === null || activeLayer == null) return;
		svg.current.selectAll("*").remove();
		const { radius, strokeWidth, opacity } = getSvgSize();
		line.current = svg.current
			.selectAll(".line")
			.data(new Array(10).fill(null))
			.enter()
			.append("path")
			.attr("class", "line")
			.attr("stroke-width", strokeWidth * 0.7)
			.attr("stroke-opacity", opacity)
			.attr("stroke", "#77172A");

		svg.current
			.selectAll(".handle")
			.data(layers.current[activeLayer].points)
			.enter()
			.append("circle")
			.attr("class", "handle")
			.attr("fill", "transparent")
			.attr("stroke-width", strokeWidth)
			.attr("stroke-opacity", opacity)
			.attr("r", radius)
			.attr("filter", "invert(1)")
			.attr("stroke", "#fff")
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
	useEffect(() => {
		// alert(warpRealTime);
	}, [warpRealTime]);

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
		setResults((state) => {
			const newState = { ...state };
			newState[activeLayer] = {
				result: tempCanvas.toDataURL(),
				width,
				height,
				id: activeLayer,
			};
			return newState;
		});
	};
	const handleDeleteLayer = (id) => {
		const keys = Object.keys(layers.current);
		if (keys.length === 1) return;
		console.log("deleting", id);
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
		const rMinSize = 3;
		const rMaxSize = 20;
		const size = Math.min(canvas.current.width, canvas.current.height);
		let radius = size / 45;
		radius = Math.max(rMinSize, Math.min(rMaxSize, radius));
		if (size * scale.current > 800) radius *= 0.5;
		const opacity = Math.max(lerp(0.6, 1, 1 - scale.current + 1), 0.6);
		console.log(size);

		return { radius, strokeWidth: radius / 2, opacity };
	};

	return (
		<div
			className={`h-full dot-pattern ${
				disabled ? "cursor-default" : "cursor-grab"
			}`}
		>
			{Object.keys(layers.current).length ? (
				<div className="p-1 px-2 flex">
					{Object.keys(layers.current).map((key, index) => (
						<div
							key={key}
							className={`px-3 group ${
								activeLayer === key ? "border-b-2 border-primary1" : ""
							}`}
						>
							<span
								className="cursor-pointer"
								onClick={() => setActiveLayer(key)}
							>
								{layers.current[key].name}
							</span>
							<span
								title="Delete"
								className="cursor-pointer text-red-600 text-sm ml-3 opacity-0 group-hover:opacity-100"
								onClick={() => handleDeleteLayer(key)}
							>
								X
							</span>
						</div>
					))}
					<div className="px-3 cursor-pointer" onClick={addLayer}>
						+
					</div>
				</div>
			) : null}
			<TransformWrapper
				scale={scale}
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
