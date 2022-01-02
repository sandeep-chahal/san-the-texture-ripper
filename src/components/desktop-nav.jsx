import React, { useEffect, useState } from "react";
import CoffeeSvg from "./svg/coffee-svg";
import MailSvg from "./svg/mail-svg";
import WhatsnewSvg from "./svg/whatsnew-svg";
import ResetSvg from "./svg/reset-svg";
import EngineSvg from "./svg/engine-svg";
import ExportSvg from "./svg/export-svg";
import ImportSvg from "./svg/import-svg";
import InstallSvg from "./svg/install-svg";
import MoreSvg from "./svg/more-svg";

const DesktopNav = ({
	handleFileChange,
	setWarpRealTime,
	onExport,
	handleReset,
	setShowWhatsNew,
	warpRealTime,
	setFile,
	importRef,
	warpLibrary,
	setWarpLibrary,
	cvLoaded,
}) => {
	const [showMore, setShowMore] = useState(false);

	const onDropDown = () => {
		setShowMore((showMore) => !showMore);
	};

	useEffect(() => {
		const handleClick = () => {
			setShowMore(false);
			document.removeEventListener("click", handleClick);
		};
		if (showMore) {
			document.addEventListener("click", handleClick, false);
		}
		return () => {
			document.removeEventListener("click", handleClick);
		};
	}, [showMore]);

	return (
		<ul className="bg-primary1 flex items-center">
			<input
				id="import-files"
				hidden
				type="file"
				accept="image/png, image/jpeg , image/webp"
				onChange={(e) =>
					handleFileChange(e.target.files[0], () => (e.target.value = ""))
				}
			/>
			<li className="w-min-20 px-4 h-full border-l-2 border-primary1">
				<label
					ref={importRef}
					htmlFor="import-files"
					title="Import Image (I)"
					className="cursor-pointer w-full h-full flex items-center justify-center"
				>
					{/* import icon */}
					<ImportSvg />
					Import
				</label>
			</li>
			<li
				onClick={onExport}
				title="Export (E)"
				className="w-min-20 px-4 h-full border-l-2 border-primary1 cursor-pointer flex items-center justify-center"
			>
				{/* export icon */}
				<ExportSvg />
				Export
			</li>
			<li
				title="Warping Library"
				className="w-min-20 px-4 h-full border-l-2 border-primary1 cursor-pointer flex items-center justify-center"
			>
				<select
					value={warpLibrary}
					className="p-1 bg-primary1 outline-none"
					onChange={(e) => setWarpLibrary(e.target.value)}
				>
					<option value="glfx">GLFX</option>
					<option
						title={!cvLoaded ? "downloading" : ""}
						disabled={!cvLoaded}
						value="opencv"
					>
						OpenCV
					</option>
				</select>
			</li>
			<li
				onClick={() => setWarpRealTime((s) => !s)}
				title="Turn On/Off Real Time Warping (W)"
				className="w-min-20 px-4 h-full border-l-2 border-primary1 cursor-pointer flex items-center justify-center"
			>
				{/* engine icon */}
				<EngineSvg />
				Warp Real Time
				<span
					className={`${
						warpRealTime ? "bg-green-600" : "bg-primary2"
					} w-3 h-3 ml-3 rounded-full`}
				></span>
			</li>
			<li
				onClick={handleReset}
				title="Reset (R)"
				className="w-min-20 px-4 h-full border-l-2 border-primary1 cursor-pointer flex items-center justify-center"
			>
				{/* reset icon */}
				<ResetSvg />
				Reset
			</li>

			<li
				onClick={onDropDown}
				className="relative w-min-20 px-4 h-full border-l-2 border-primary1 cursor-pointer flex justify-center items-center"
			>
				{/* more icon */}
				<MoreSvg />
				More
				{/* dropdown */}
				{showMore ? (
					<ul className="absolute w-48 bg-primary2 top-full right-0 border-2 border-primary1 z-50">
						<li>
							{/* coffee icon */}

							<a
								className="p-2 border-b-2 border-primary1 bg-primary3 text-primary1 cursor-pointer flex items-center"
								href="https://www.buymeacoffee.com/sandeepchahal"
								target="_blank"
							>
								<CoffeeSvg />
								Buy me a coffee
							</a>
						</li>
						<li>
							{/* mail icon */}

							<a
								className="p-2 border-b-2 border-primary1 cursor-pointer flex items-center"
								href="mailto: 6sandripper9@gmail.com"
							>
								<MailSvg />
								Contact
							</a>
						</li>
						<li>
							{/* install icon */}
							<a
								className="p-2 border-b-2 border-primary1 cursor-pointer flex items-center"
								href="https://support.google.com/chrome/answer/9658361"
								target="_blank"
							>
								<InstallSvg />
								How to Install
							</a>
						</li>
						<li
							onClick={() => setShowWhatsNew(true)}
							className="p-2 cursor-pointer flex items-center"
						>
							{/* whatsnew icon */}
							<WhatsnewSvg />
							Whats New
						</li>
					</ul>
				) : null}
			</li>
		</ul>
	);
};

export default DesktopNav;
