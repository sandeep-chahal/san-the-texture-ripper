import React, { useRef, useEffect, useState } from "react";
import { useStore } from "../store";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import * as d3 from "d3";
import fx from "glfx";

const tempCanvas = document.createElement("canvas");
const tempCanvasCtx = tempCanvas.getContext("2d");

function Editor() {
	const svg = useRef(null);
	const [disabled, setDisabled] = useState(true);
	const canvas = useRef();
	const scale = useRef(1);
	const line = useRef(null);
	const { file, setResults } = useStore();
	const layers = useRef([]);
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
				canvas.current
					.getContext("2d")
					.clearRect(0, 0, canvas.current.width, canvas.current.height);

				canvas.current.width = img.width;
				canvas.current.height = img.height;
				canvas.current.getContext("2d").drawImage(img, 0, 0);
				layers.current = [getDefaultLayerConfig()];
				glfxCanvas.current = fx.canvas();
				texture.current = glfxCanvas.current.texture(img);
				setActiveLayer(0);
				drawCropBox();
			};
		}
	}, [file]);
	useEffect(() => {
		const onKeyDown = (e) => {
			if (e.keyCode === 17 && disabled) {
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
	}, []);

	const getDefaultLayerConfig = () => {
		return [
			[20, 20],
			[canvas.current.width - 20, 20],
			[canvas.current.width - 20, canvas.current.height - 20],
			[20, canvas.current.height - 20],
		];
	};

	useEffect(() => {
		drawCropBox();
	}, [file, activeLayer]);

	const drawCropBox = () => {
		if (layers.current.length === 0 || activeLayer == null) return;
		svg.current.selectAll("*").remove();

		line.current = svg.current
			.selectAll(".line")
			.data(new Array(10).fill(null))
			.enter()
			.append("path")
			.attr("class", "line")
			.attr("stroke-dasharray", "5,10,5")
			.attr("stroke", "#77172A");

		svg.current
			.selectAll(".handle")
			.data(layers.current[activeLayer])
			.enter()
			.append("circle")
			.attr("class", "handle")
			.attr("fill", "transparent")
			.attr("stroke-width", "2")
			.attr("stroke", "#fff")
			.attr("data-index", (d, i) => i)
			.attr("transform", function (d) {
				return "translate(" + d + ")";
			})
			.attr("r", 7)
			.call(
				d3.drag().on("drag", function (d) {
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
						layers.current[activeLayer][d3.select(this).attr("data-index")] = [
							d.x,
							d.y,
						];
						updatePerspectiveGrid();
					}
				})
			);

		updatePerspectiveGrid();
		function updatePerspectiveGrid() {
			updateResultGLFX();
			const points = layers.current[activeLayer];
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

	function updateResultGLFX() {
		// lazy implementation
		let points = layers.current[activeLayer];
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
	}

	return (
		<div
			className={`h-full dot-pattern ${
				disabled ? "cursor-default" : "cursor-grab"
			}`}
		>
			{layers.current && layers.current.length ? (
				<div className="p-1 px-2 flex">
					{layers.current.map((layer, index) => (
						<div
							key={index}
							onClick={() => setActiveLayer(index)}
							className={`px-3 cursor-pointer ${
								activeLayer === index ? "border-b-2 border-primary1" : ""
							}`}
						>
							Layer {index + 1}
						</div>
					))}
					<div
						className="px-3 cursor-pointer"
						onClick={() => {
							layers.current = [...layers.current, getDefaultLayerConfig()];
							setActiveLayer((currentActiveLayer) => currentActiveLayer + 1);
						}}
					>
						+
					</div>
				</div>
			) : null}
			<TransformWrapper
				minScale={0.1}
				limitToBounds={false}
				disabled={disabled}
				onZoomStop={(ref) => {
					scale.current = ref.state.scale;
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
}

export default Editor;
