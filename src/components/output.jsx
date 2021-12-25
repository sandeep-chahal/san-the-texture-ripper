import React, { useRef, useState, useEffect } from "react";
import { toPng } from "html-to-image";
import Resizable from "react-resizable-box";
import { useStore } from "../store";
import CloseSvg from "../components/svg/close-svg";
import ExportSvg from "../components/svg/export-svg";

const parseResults = (results) => {
	if (Object.keys(results || {}).length === 0) {
		return {};
	}
	const sizes = {};
	Object.keys(results).forEach((key) => {
		sizes[key] = [results[key].width, results[key].height];
	});
	return sizes;
};

function Output({ onClose }) {
	const { results } = useStore();
	const [sizes, setSizes] = useState(() => parseResults(results));
	const printComponent = useRef(null);

	const handleExport = () => {
		toPng(printComponent.current)
			.then((dataUrl) => {
				var link = document.createElement("a");
				link.download = "result.png";
				link.href = dataUrl;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			})
			.catch(function (error) {
				console.error("oops, something went wrong!", error);
			});
	};

	const handleKeyPress = (e) => {
		if (e.key === "Escape") onClose();
	};

	useEffect(() => {
		window.addEventListener("keydown", handleKeyPress);
		return () => {
			window.removeEventListener("keydown", handleKeyPress);
		};
	}, []);

	return (
		<div className="animate-reveal fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div
				style={{ width: "90%", height: "90%" }}
				className="bg-primary1 text-primary2 flex flex-col"
			>
				{/* header */}
				<div className="p-2 px-6 bg-primary2 border-primary1 ">
					<h1 className="text-2xl">Output</h1>
					<span className="text-sm">Drag images from sides to resize</span>
				</div>
				{/* output */}
				<div className="overflow-y-auto">
					<div ref={printComponent} className="w-max max-w-full flex flex-wrap">
						{Object.keys(results || {}).map((key, index) => {
							const data = results[key];
							const [width, height] = sizes[key];
							return (
								<Resizable
									width={width}
									height={height}
									maxHeight={height * 10}
									maxWidth={width * 10}
									className="m-2"
									key={index}
									minHeight={200}
									minWidth={200}
								>
									<img
										className="w-full h-full inline-block pointer-events-none"
										src={data.result}
									/>
								</Resizable>
							);
						})}
					</div>
				</div>

				{/* buttons */}
				<div className="p-2 bg-primary2 border-primary1 mt-auto flex justify-between">
					<button
						onClick={onClose}
						title="Close (Esc)"
						className="border-2 border-primary1 p-1 px-2 rounded-md flex items-center"
					>
						{/* close icon */}
						<CloseSvg />
						Close
					</button>
					<button
						onClick={handleExport}
						ref={(ref) => {
							if (ref) {
								ref.focus();
							}
						}}
						className="border-2 border-primary1 p-1 px-2 rounded-md flex items-center"
					>
						{/* export icon */}
						<ExportSvg />
						Export
					</button>
				</div>
			</div>
		</div>
	);
}

export default Output;
