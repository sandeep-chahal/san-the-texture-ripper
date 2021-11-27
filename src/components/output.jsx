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
		<div className="animate-reveal fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center">
			<div
				style={{ width: "90%", height: "90%" }}
				className="bg-primary1 flex flex-col"
			>
				{/* header */}
				<div className="p-2 px-6 text-2xl bg-primary2 border-primary1">
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
				<div className="p-2 bg-primary2 border-primary1 mt-auto flex justify-between">
					<button
						onClick={onClose}
						className="border-2 border-primary1 p-1 px-2 rounded-md flex items-center"
					>
						{/* close icon */}
						<svg
							title="Delete"
							onClick={() => handleDeleteLayer(key)}
							xmlns="http://www.w3.org/2000/svg"
							fill="var(--color-bg-secondary-2)"
							viewBox="0 0 30 30"
							width="15px"
							height="15px"
							className="mr-2"
						>
							<path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z" />
						</svg>
						Close
					</button>
					<button
						onClick={handleExport}
						className="border-2 border-primary1 p-1 px-2 rounded-md flex items-center"
					>
						{/* export icon */}
						<svg
							className="mr-2"
							xmlns="http://www.w3.org/2000/svg"
							width="15px"
							height="15px"
							viewBox="0 0 122.88 114.318"
						>
							<g>
								<path
									fill-rule="evenodd"
									clip-rule="evenodd"
									d="M122.88,35.289L87.945,70.578v-17.58c-22.091-4.577-39.542,0.468-52.796,17.271 c2.301-34.558,25.907-51.235,52.795-52.339L87.945,0L122.88,35.289L122.88,35.289z"
								/>
								<path d="M6.908,23.746h35.626c-4.587,3.96-8.71,8.563-12.264,13.815H13.815v62.943h80.603V85.831l13.814-13.579v35.159 c0,3.814-3.093,6.907-6.907,6.907H6.908c-3.815,0-6.908-3.093-6.908-6.907V30.653C0,26.838,3.093,23.746,6.908,23.746L6.908,23.746 z" />
							</g>
						</svg>
						Export
					</button>
				</div>
			</div>
		</div>
	);
}

export default Output;
