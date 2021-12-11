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
		console.log(glfxCanvas.current);
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
		if (newWidth === null) newWidth = fakeDim;
		if (newHeight === null) newHeight = fakeDim;

		const newPixelData = tempCanvasCtx.getImageData(0, 0, newWidth, newHeight);
		tempCanvasCtx.clearRect(0, 0, fakeDim, fakeDim);
		tempCanvas.width = newWidth;
		tempCanvas.height = newHeight;
		tempCanvasCtx.putImageData(newPixelData, 0, 0);

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
				<div className="p-1 px-2 flex items-start text-primary2">
					<div className="flex overflow-x-auto scroll-bar-1">
						{Object.keys(layers.current).map((key, index) => (
							<div
								key={key}
								className={`px-3 group min-w-max ${
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
								<svg
									title="Delete"
									onClick={() => handleDeleteLayer(key)}
									className="fill-current inline cursor-pointer text-red-600 text-sm ml-3 opacity-0 group-hover:opacity-100 transition-opacity transform hover:scale-110"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 30 30"
									width="15px"
									height="15px"
								>
									<path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z" />
								</svg>
							</div>
						))}
					</div>
					{/* add icon */}
					<div className="mt-1 flex items-center ml-2 transition-transform transform rotate-0 hover:rotate-90 hover:scale-110">
						<svg
							className="fill-current text-primary2 block cursor-pointer"
							onClick={addLayer}
							xmlns="http://www.w3.org/2000/svg"
							id="Layer_1"
							data-name="Layer 1"
							viewBox="0 0 122.88 122.88"
							width="15px"
							height="15px"
						>
							<path d="M61.44,0A61.46,61.46,0,1,1,18,18,61.25,61.25,0,0,1,61.44,0ZM88.6,56.82v9.24a4,4,0,0,1-4,4H70V84.62a4,4,0,0,1-4,4H56.82a4,4,0,0,1-4-4V70H38.26a4,4,0,0,1-4-4V56.82a4,4,0,0,1,4-4H52.84V38.26a4,4,0,0,1,4-4h9.24a4,4,0,0,1,4,4V52.84H84.62a4,4,0,0,1,4,4Zm8.83-31.37a50.92,50.92,0,1,0,14.9,36,50.78,50.78,0,0,0-14.9-36Z" />
						</svg>
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
