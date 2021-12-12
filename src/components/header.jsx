import React, { useEffect, useState } from "react";
import { useStore } from "../store";
import useWindowSize from "../hooks/useWIndowSize";
import DesktopNav from "./desktop-nav";
import MobileNav from "./mobile-nav";

const Header = ({ onExport, handleFileChange }) => {
	const { setFile, warpRealTime, setWarpRealTime, setShowWhatsNew } =
		useStore();
	const { width, height } = useWindowSize();
	const handleReset = () => {
		window.location.reload();
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
		</header>
	);
};
export default Header;
