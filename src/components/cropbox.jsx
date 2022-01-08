import React, { useRef, forwardRef, useImperativeHandle, file } from "react";
import * as d3 from "d3";

const CropBox = forwardRef(
	(
		{
			canvas,
			layers,
			updateResults,
			activeLayer,
			getSvgSize,
			warpRealTime,
		},
		ref
	) => {
		const svg = useRef(null); // cropbox svg
		const line = useRef(null); // cropbox lines/grid lines

		// draw d3 svg cropbox
		const drawCropBox = () => {
			if (
				file === null ||
				activeLayer == null ||
				!layers.current[activeLayer]
			)
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
				.attr("stroke", "#EA1953")
				.attr("data-index", (d, i) => i)
				.attr("transform", function (d) {
					return "translate(" + d + ")";
				})
				.call(
					d3
						.drag()
						// when handles(circles) are dragged
						.on("drag", function (d) {
							// check if new position is within canvas
							if (
								d.x > 0 &&
								d.x < canvas.current.width &&
								d.y > 0 &&
								d.y < canvas.current.height
							) {
								// update points
								d3.select(this).attr(
									"transform",
									"translate(" + d.x + "," + d.y + ")"
								);
								layers.current[activeLayer].points[
									d3.select(this).attr("data-index")
								] = [d.x, d.y];
								updatePerspectiveGrid();
								if (!warpRealTime) return;
								updateResults();
							}
						})
						.on("end", () => {
							updateResults();
						})
				);
			updatePerspectiveGrid();
			// draw cropbox lines/grid
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
			// get mid point of a line/two points
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

		useImperativeHandle(ref, () => ({
			drawCropBox,
		}));

		return (
			<svg id="svg" className="absolute top-0 left-0 w-full h-full">
				<g
					ref={(ref) => {
						svg.current = d3.select(ref);
					}}
				></g>
			</svg>
		);
	}
);

export default CropBox;
