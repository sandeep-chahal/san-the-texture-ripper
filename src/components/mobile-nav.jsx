import React, { useEffect, useState } from "react";
import CoffeeSvg from "../components/svg/coffee-svg";
import MailSvg from "../components/svg/mail-svg";
import WhatsnewSvg from "../components/svg/whatsnew-svg";
import ResetSvg from "../components/svg/reset-svg";
import EngineSvg from "../components/svg/engine-svg";
import ExportSvg from "../components/svg/export-svg";
import ImportSvg from "../components/svg/import-svg";
import InstallSvg from "./svg/install-svg";
import OpencvSvg from "./svg/opencv-svg";
import GithubSvg from "./svg/github-svg";

const MobileNav = ({
	handleFileChange,
	setWarpRealTime,
	onExport,
	handleReset,
	setShowWhatsNew,
	warpRealTime,
	newUpdate,
}) => {
	const [menuOpen, setMenuOpen] = useState(false);

	useEffect(() => {
		if (!menuOpen) return;
		const handleClick = (e) => {
			if (e.target.id === "label") {
				return;
			}
			setMenuOpen(false);
			document.removeEventListener("click", handleClick);
		};
		document.addEventListener("click", handleClick, false);
		return () => {
			document.removeEventListener("click", handleClick);
		};
	}, [menuOpen]);

	return (
		<div className="relative z-40">
			<div
				className="flex flex-col items-end cursor-pointer h-5 pt-2"
				onClick={() => setMenuOpen((o) => !o)}
			>
				<div style={{ height: "1.5px" }} className="w-6 bg-primary3" />
				<div
					style={{ height: "1.5px" }}
					className="w-4 mt-1 bg-primary3"
				/>
			</div>
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
			{menuOpen && (
				<ul className="bg-primary1 flex flex-col w-max items-start absolute top-full right-0">
					<li className="my-2 px-4 h-full w-full">
						<label
							id="label"
							htmlFor="import-files"
							className="cursor-pointer w-full h-full flex items-center"
						>
							{/* import icon */}
							<ImportSvg />
							Import
						</label>
					</li>
					<li
						onClick={onExport}
						className="my-2 px-4 h-full cursor-pointer flex items-center w-full"
					>
						{/* export icon */}
						<ExportSvg />
						Export
					</li>

					<li
						className={`my-2 px-4 h-full cursor-pointer flex items-center w-full`}
					>
						<OpencvSvg />
						OpenCV
					</li>
					<li
						onClick={() => setWarpRealTime((s) => !s)}
						className="my-2 px-4 h-full cursor-pointer flex items-center w-full"
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
						className="my-2 px-4 h-full cursor-pointer flex items-center w-full"
					>
						{/* reset icon */}
						<ResetSvg />
						Reset
					</li>

					<li className="my-2 px-4 bg-primary3 w-full">
						<a
							className="text-primary1 cursor-pointer flex items-center"
							href="https://www.buymeacoffee.com/sandeepchahal"
							target="_blank"
						>
							<CoffeeSvg />
							Buy me a coffee
						</a>
					</li>
					<li className="my-2 px-4 w-full">
						<a
							className="cursor-pointer flex items-center"
							href="mailto: 6sandripper9@gmail.com"
						>
							<MailSvg />
							Contact
						</a>
					</li>
					<li className="my-2 px-4 w-full">
						{/* github icon */}
						<a
							className="cursor-pointer flex items-center"
							href="https://github.com/sandeep-chahal/san-the-texture-ripper"
							target="_blank"
						>
							<GithubSvg />
							Github
						</a>
					</li>
					<li className="my-2 px-4 w-full">
						{/* install icon */}
						<a
							className="cursor-pointer flex items-center"
							href="https://support.google.com/chrome/answer/9658361"
							target="_blank"
						>
							<InstallSvg />
							How to Install
						</a>
					</li>
					<li
						onClick={() => setShowWhatsNew(true)}
						className="my-2 px-4 cursor-pointer flex items-center w-full"
					>
						{/* whatsnew icon */}
						<WhatsnewSvg />
						Whats New
						{newUpdate && (
							<div className="-mt-4 ml-1 w-2 h-2 bg-red rounded-full" />
						)}
					</li>
				</ul>
			)}
		</div>
	);
};

export default MobileNav;
