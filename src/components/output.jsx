import React, { useRef } from "react";
import { toPng } from "html-to-image";
import { useStore } from "../store";

function Output({ onClose }) {
	const { results } = useStore();
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

	return (
		<div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center">
			<div
				style={{ width: "90%", height: "90%" }}
				className="bg-primary1 flex flex-col"
			>
				{/* header */}
				<div className="p-2 px-6 text-2xl border-b-4 border-primary1">
					<h1>Output</h1>
				</div>
				{/* output */}
				<div className="overflow-y-auto">
					<div ref={printComponent} className="w-max max-w-full">
						{Object.values(results || {}).map((data, index) => (
							<img
								className="inline-block m-2"
								style={{
									width: data.width,
									height: data.height,
								}}
								width={data.width}
								height={data.height}
								key={index}
								src={data.result}
							/>
						))}
					</div>
				</div>

				{/* buttons */}
				<div className="p-2 border-t-4 border-primary1 mt-auto flex justify-between">
					<button
						onClick={onClose}
						className="border-2 border-primary1 p-1 px-2 rounded-md"
					>
						Close
					</button>
					<button
						onClick={handleExport}
						className="border-2 border-primary1 p-1 px-2 rounded-md"
					>
						Export
					</button>
				</div>
			</div>
		</div>
	);
}

export default Output;
