import React, { useEffect } from "react";
import { readImage } from "../utils";
import { useStore } from "../store";

const IMAGE_FORMATS = ["image/png", "image/jpg", "image/jpeg", "image/webp"];

function ActionBar({ onExport, warp }) {
	const { setFile, warpRealTime, setWarpRealTime } = useStore();

	const handleFileChange = async (e) => {
		try {
			const file = e.target.files[0];
			e.target.value = "";
			if (IMAGE_FORMATS.includes(file.type)) {
				const base64File = await readImage(file);
				setFile(base64File);
			} else {
				console.log("FILE TYPE NOT SUPPORTED", file.type);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const handleReset = () => {
		setFile(null);
		setWarpRealTime(false);
	};

	return (
		<div className="absolute w-full h-16 bottom-12 flex justify-center ">
			<ul className="w-2/4 h-full bg-primary2 border-4 border-primary1 rounded-2xl flex items-center overflow-hidden">
				<input
					id="import-files"
					hidden
					type="file"
					// multiple
					accept="image/png, image/jpeg , image/webp"
					onChange={handleFileChange}
				/>
				<li className="w-min-20 px-4 h-full border-r-4 border-primary1">
					<label
						htmlFor="import-files"
						className="cursor-pointer w-full h-full flex items-center justify-center"
					>
						Import
					</label>
				</li>
				<li
					onClick={onExport}
					className="w-min-20 px-4 h-full border-r-4 border-primary1 cursor-pointer flex items-center justify-center"
				>
					Export
				</li>
				<li
					onClick={() => setWarpRealTime((s) => !s)}
					className="w-min-20 px-4 h-full border-r-4 border-primary1 cursor-pointer flex items-center justify-center"
				>
					Warp Real Time
					<span
						className={`${
							warpRealTime ? "bg-green-600" : "bg-gray-500"
						} w-3 h-3 ml-3 rounded-full`}
					></span>
				</li>
				<li
					onClick={handleReset}
					className="w-min-20 px-4 h-full border-r-4 border-primary1 cursor-pointer flex items-center justify-center"
				>
					Reset
				</li>
			</ul>
		</div>
	);
}

export default React.memo(ActionBar);
