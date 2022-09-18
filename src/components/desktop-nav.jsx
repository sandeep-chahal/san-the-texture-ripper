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
import GithubSvg from "./svg/github-svg";

const DesktopNav = ({
	handleFileChange,
	setWarpRealTime,
	onExport,
	handleReset,
	setShowWhatsNew,
	warpRealTime,
	importRef,

	newUpdate,
}) => {
	const [showMore, setShowMore] = useState(false);

	// useEffect(() => {
	// 	const handleClick = () => {
	// 		setShowMore(false);
	// 		document.removeEventListener("click", handleClick);
	// 	};
	// 	if (showMore) {
	// 		document.addEventListener("click", handleClick);
	// 	}
	// 	return () => {
	// 		document.removeEventListener("click", handleClick);
	// 	};
	// }, [showMore]);

	return (
		<ul className="bg-primary1 flex items-center">
			<input
				id="import-files"
				hidden
				type="file"
				accept="image/png, image/jpeg , image/webp"
				onChange={(e) =>
					handleFileChange(
						e.target.files[0],
						() => (e.target.value = "")
					)
				}
			/>
			<li className="w-min-20 px-4 h-full border-l-2 border-primary1 hover:underline">
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
				className="w-min-20 px-4 h-full border-l-2 border-primary1 cursor-pointer flex items-center justify-center  hover:underline"
			>
				{/* export icon */}
				<ExportSvg />
				Export
			</li>
			{/* <li
				onClick={() => setWarpRealTime((s) => !s)}
				title="Turn On/Off Real Time Warping (W)"
				className="w-min-20 px-4 h-full border-l-2 border-primary1 cursor-pointer flex items-center justify-center"
			>
				<EngineSvg />
				Warp Real Time
				<span
					className={`${
						warpRealTime ? "bg-green-600" : "bg-primary2"
					} w-3 h-3 ml-3 rounded-full`}
				></span>
			</li> */}
			<li
				onClick={handleReset}
				title="Reset (R)"
				className="w-min-20 px-4 h-full border-l-2 border-primary1 cursor-pointer flex items-center justify-center  hover:underline"
			>
				{/* reset icon */}
				<ResetSvg />
				Reset
			</li>

			<li
				onClick={() => setShowMore(!showMore)}
				className="relative w-min-20 px-4 h-full border-l-2 border-primary1 cursor-pointer flex justify-center items-center  hover:underline"
			>
				{/* more icon */}
				<MoreSvg />
				More
				{newUpdate && (
					<div className="-mt-4 ml-1 w-2 h-2 bg-red rounded-full" />
				)}
				{/* dropdown */}
				{showMore ? (
					<ul className="absolute w-48 bg-primary2 top-full right-0 border-2 border-primary1 z-50">
						<li>
							{/* coffee icon */}

							<a
								className="p-2 border-b-2 border-primary1 bg-primary3 text-primary1 cursor-pointer flex items-center hover:underline"
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
								className="p-2 border-b-2 border-primary1 cursor-pointer flex items-center  hover:underline"
								href="mailto: 6sandripper9@gmail.com"
							>
								<MailSvg />
								Contact
							</a>
						</li>
						<li>
							{/* github icon */}
							<a
								className="p-2 border-b-2 border-primary1 cursor-pointer flex items-center hover:underline"
								href="https://github.com/sandeep-chahal/san-the-texture-ripper"
								target="_blank"
							>
								<GithubSvg />
								Github
							</a>
						</li>
						<li>
							{/* install icon */}
							<a
								className="p-2 border-b-2 border-primary1 cursor-pointer flex items-center hover:underline"
								href="https://support.google.com/chrome/answer/9658361"
								target="_blank"
							>
								<InstallSvg />
								How to Install
							</a>
						</li>
						<li
							onClick={() => setShowWhatsNew(true)}
							className="p-2 cursor-pointer flex items-center hover:underline"
						>
							{/* whatsnew icon */}
							<WhatsnewSvg />
							Whats New
							{newUpdate && (
								<div className="-mt-4 ml-1 w-2 h-2 bg-red rounded-full" />
							)}
						</li>
					</ul>
				) : null}
			</li>
		</ul>
	);
};

export default DesktopNav;
