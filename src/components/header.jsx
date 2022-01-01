import React, { useEffect, useState, useRef } from "react";
import { useMainStore } from "../store";
import useWindowSize from "../hooks/useWinSize";
import DesktopNav from "./desktop-nav";
import MobileNav from "./mobile-nav";
import ResetPopup from "./reset-popup";

const Header = ({ onExport, handleFileChange }) => {
	const { setFile, warpRealTime, setWarpRealTime, setShowWhatsNew } =
		useMainStore();
	const { width, height } = useWindowSize();
	const [resetPopup, setResetPopup] = useState(false);
	const importRef = useRef(null);

	const handleKeyPress = (e) => {
		if (e.key === "r") setResetPopup(true);
		if (e.key === "e") onExport();
		if (e.key === "i" && importRef.current) importRef.current.click();
		if (e.key === "w") setWarpRealTime((w) => !w);
	};

	useEffect(() => {
		window.addEventListener("keypress", handleKeyPress);
		return () => {
			window.removeEventListener("keypress", handleKeyPress);
		};
	});

	const handleReset = () => {
		setResetPopup(true);
	};

	return (
		<header className="bg-primary1 text-primary2 p-3 border-b-2 border-primary1 h-16 flex items-center justify-between">
			<h1 className=" font-squada text-3xl flex justify-center">
				<img src="favicon.svg" className="w-8 h-10 mr-3" />
				Sand Ripper
			</h1>

			{width > 900 ? (
				<DesktopNav
					onExport={onExport}
					warpRealTime={warpRealTime}
					setWarpRealTime={setWarpRealTime}
					setShowWhatsNew={setShowWhatsNew}
					handleReset={handleReset}
					setFile={setFile}
					handleFileChange={handleFileChange}
					importRef={importRef}
				/>
			) : (
				<MobileNav
					onExport={onExport}
					warpRealTime={warpRealTime}
					setWarpRealTime={setWarpRealTime}
					setShowWhatsNew={setShowWhatsNew}
					handleReset={handleReset}
					setFile={setFile}
					handleFileChange={handleFileChange}
				/>
			)}
			{resetPopup ? <ResetPopup close={() => setResetPopup(false)} /> : null}
		</header>
	);
};
export default Header;
