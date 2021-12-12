import React, { useEffect, useState } from "react";
import { useStore } from "../store";
import CoffeeSvg from "../components/svg/coffee-svg";
import MailSvg from "../components/svg/mail-svg";
import WhatsnewSvg from "../components/svg/whatsnew-svg";
import ResetSvg from "../components/svg/reset-svg";
import EngineSvg from "../components/svg/engine-svg";
import ExportSvg from "../components/svg/export-svg";
import ImportSvg from "../components/svg/import-svg";
import InstallSvg from "./svg/install-svg";
import MoreSvg from "./svg/more-svg";

const Header = ({ onExport, handleFileChange }) => {
	const { setFile, warpRealTime, setWarpRealTime, setShowWhatsNew } =
		useStore();
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
	}, [showMore]);

	const handleReset = () => {
		window.location.reload();
	};

	return (
		<header className="bg-primary1 text-primary2 p-3 border-b-2 border-primary1 h-16 flex items-center justify-between">
			<h1 className=" font-squada text-3xl flex justify-center">
				<img src="favicon.svg" className="w-8 h-10 mr-3" />
				Sand Ripper
			</h1>
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
						htmlFor="import-files"
						className="cursor-pointer w-full h-full flex items-center justify-center"
					>
						{/* import icon */}
						<ImportSvg />
						Import
					</label>
				</li>
				<li
					onClick={onExport}
					className="w-min-20 px-4 h-full border-l-2 border-primary1 cursor-pointer flex items-center justify-center"
				>
					{/* export icon */}
					<ExportSvg />
					Export
				</li>
				<li
					onClick={() => setWarpRealTime((s) => !s)}
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
		</header>
	);
};
export default Header;
