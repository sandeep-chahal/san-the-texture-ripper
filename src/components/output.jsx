import React, { useRef, useState, useEffect } from "react";
import { toPng } from "html-to-image";
import Resizable from "react-resizable-box";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { useMainStore } from "../store";
import CloseSvg from "../components/svg/close-svg";
import ExportSvg from "../components/svg/export-svg";
import HeartSvg from "../components/svg/heart-svg";

function Output({ onClose }) {
	const { results } = useMainStore();
	const printComponent = useRef(null);
	const [lockAR, setLockAR] = useState(false);
	const imgRefs = useRef([]);
	const [exporting, setExporting] = useState(false);

	// toPng filter
	const filter = (node) => {
		return node.classList.contains && node.classList.contains("export");
	};

	const downloadZip = async () => {
		try {
			setExporting(true);
			var zip = new JSZip();

			await Promise.all(
				imgRefs.current.map(async (ref, index) => {
					const dataUrl = await toPng(ref, { filter });
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
		} finally {
			setExporting(false);
		}
	};

	const handleExport = async () => {
		try {
			setExporting(true);

			const dataURl = await toPng(printComponent.current, { filter });
			saveAs(dataURl, `Results ${Date.now()}.png`);
		} catch (err) {
			console.log(err);
		} finally {
			setExporting(false);
		}
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
		<div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div
				style={{ width: "90%", height: "90%" }}
				className="bg-primary2 text-primary2 flex flex-col animate-reveal "
			>
				{/* header */}
				<div className="p-2 px-6 bg-primary2 border-primary1 border-b-2">
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
									className="export m-2 w-full h-full group"
									key={index}
									minHeight={200}
									minWidth={200}
									lockAspectRatio={lockAR}
									handlerClasses={{
										bottomRight: `group-hover:opacity-20 bg-yellow-400 opacity-0`,
										right: `group-hover:opacity-20 ${
											!lockAR && "bg-yellow-400"
										} opacity-0`,
										bottom: `group-hover:opacity-20 ${
											!lockAR && "bg-yellow-400"
										} opacity-0`,
									}}
								>
									<img
										ref={(ref) => {
											if (ref) {
												imgRefs.current[index] = ref;
											}
										}}
										className="export w-full h-full inline-block pointer-events-none"
										src={data.result}
									/>
								</Resizable>
							);
						})}
					</div>
				</div>

				{/* buttons */}
				<div className="p-2 bg-primary2 border-primary1 mt-auto flex justify-between border-t-2">
					<button
						onClick={onClose}
						title="Close (Esc)"
						className="border-2 border-primary1 p-1 px-2 rounded-md flex items-center"
					>
						{/* close icon */}
						<CloseSvg />
						Close
					</button>
					{!exporting ? (
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
					) : (
						<HeartSvg size={35} />
					)}
				</div>
			</div>
		</div>
	);
}

export default Output;
