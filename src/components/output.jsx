import React, { useRef, useState, useEffect } from "react";
import { toPng } from "html-to-image";
import Resizable from "react-resizable-box";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { useMainStore } from "../store";
import CloseSvg from "../components/svg/close-svg";
import ExportSvg from "../components/svg/export-svg";

function Output({ onClose }) {
	const { results } = useMainStore();
	const printComponent = useRef(null);
	const [lockAR, setLockAR] = useState(false);
	const imgRefs = useRef([]);

	const downloadZip = async () => {
		try {
			var zip = new JSZip();

			await Promise.all(
				imgRefs.current.map(async (ref, index) => {
					const dataUrl = await toPng(ref);
					zip.file(`${index}.png`, dataUrl.split("base64,")[1], {
						base64: true,
					});
				})
			);
			saveAs(
				await zip.generateAsync({ type: "blob" }),
				`Results ${Date.now()}.zip`
			);
		} catch (err) {
			console.log(err);
		}
	};

	const handleExport = async () => {
		const dataURl = await toPng(printComponent.current);
		saveAs(dataURl, `Results ${Date.now()}.png`);
	};

	const handleKeyDown = (e) => {
		if (e.key === "Escape") onClose();
		if (e.key === "Control" || e.key === "Shift") {
			window.addEventListener("keyup", handleKeyUp);
			setLockAR(true);
		}
	};
	const handleKeyUp = () => {
		setLockAR(false);
		window.removeEventListener("keyup", handleKeyUp);
	};

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
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
					<span className="text-sm">
						Drag images from sides to resize
					</span>
				</div>
				{/* output */}
				<div className="relative h-full overflow-auto">
					<div
						ref={printComponent}
						className="absolute top-0 left-0 flex flex-wrap"
					>
						{Object.keys(results || {}).map((key, index) => {
							const data = results[key];
							const [width, height] = [
								results[key].width,
								results[key].height,
							];
							return (
								<Resizable
									width={width}
									height={height}
									maxHeight={height * 10}
									maxWidth={width * 10}
									className="m-2 w-full h-full"
									key={index}
									minHeight={200}
									minWidth={200}
									lockAspectRatio={lockAR}
								>
									<img
										ref={(ref) => {
											if (ref) {
												imgRefs.current[index] = ref;
											}
										}}
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
					<div className="flex">
						<button
							title="Export all textures separately in zip file"
							onClick={downloadZip}
							className="border-2 border-primary1 p-1 px-2 rounded-md flex items-center mr-2"
						>
							{/* export icon */}
							<ExportSvg />
							Export Zip
						</button>
						<button
							title="Export one big single texture"
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
							Export Png
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Output;
