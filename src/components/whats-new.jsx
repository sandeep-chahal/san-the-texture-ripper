import React, { useEffect } from "react";
import DeleteSvg from "../components/svg/delete-svg";
import { useMainStore } from "../store";

function WhatsNew() {
	const { setShowWhatsNew, setNewUpdate } = useMainStore();

	const handleKeyPress = (e) => {
		if (e.key === "Escape") setShowWhatsNew(false);
	};

	useEffect(() => {
		setNewUpdate(false);
		localStorage.setItem("lastUpdate", import.meta.env.VITE_LAST_UPDATE);
		window.addEventListener("keydown", handleKeyPress);
		return () => {
			window.removeEventListener("keydown", handleKeyPress);
		};
	}, []);

	return (
		<div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center">
			<div
				style={{ height: "90%" }}
				className="relative bg-primary2 text-primary3 flex flex-col w-11/12 xl:w-3/4  animate-reveal rounded-lg"
			>
				{/* header */}
				<div className="">
					<h1 className="text-center mt-4 text-2xl md:text-4xl">
						<span className="text-xl md:text-2xl">🎉✨</span> What's
						New <span className="text-xl md:text-2xl">🎉✨</span>
					</h1>
					<div
						className="absolute top-4 right-4"
						onClick={() => setShowWhatsNew(false)}
					>
						<DeleteSvg setShowWhatsNew={setShowWhatsNew} />
					</div>
				</div>
				{/* header ends */}
				{/* updates container */}
				<div className="w-11/12 md:w-4/5 mx-auto mt-4 overflow-auto scrollbar-none">
					{/* updates header */}
					<h2 className="mb-2 text-xl md:text-3xl mt-2 text-center md:text-left">
						<span className="text-base md:text-lg">🎁🎀</span> May
						2022 <span className="text-base md:text-lg">🎁🎀</span>
					</h2>
					{/* updates list */}
					<ul className="text-base md:text-2xl flex-wrap">
						<li data-icon="📭 " className="">
							<a
								className="border-b-2 border-primary2"
								target="_blank"
								href="https://github.com/sandeep-chahal/san-the-texture-ripper"
							>
								Made opensource
							</a>
						</li>
						<li data-icon="🌳 " className="">
							Removed GLFX and made opencv default warp library
						</li>
					</ul>
					{/* divider */}
					<div className="h-1 bg-secondary1 w-full mt-4"></div>
					<h2 className="mb-2 text-xl md:text-3xl mt-2 text-center md:text-left">
						<span className="text-base md:text-lg">🎁🎀</span>{" "}
						January 2022{" "}
						<span className="text-base md:text-lg">🎁🎀</span>
					</h2>
					{/* updates list */}
					<ul className="text-base md:text-2xl flex-wrap">
						<li data-icon="🦄 " className="">
							Added OpenCV library for faster and better warping
							<span className="text-xs md:text-sm italic">
								{" "}
								recommended to use opencv
							</span>
						</li>
						<li data-icon="🦄 " className="">
							Able to export single PNG texture or zip individual
							textures
						</li>
						<li data-icon="🦄 " className="">
							Lock aspect ration when resizing final texture in
							output window
						</li>
						<li data-icon="🦄 " className="">
							Fixed large texture squashed bug
						</li>
						<li data-icon="🦄 " className="">
							More mobile friendly
						</li>
					</ul>
					{/* divider */}
					<div className="h-1 bg-secondary1 w-full mt-4"></div>
					{/* updates header */}
					<h2 className="mb-2 text-xl md:text-3xl mt-2 text-center md:text-left">
						<span className="text-base md:text-lg">🎁🎀</span>{" "}
						December 2021{" "}
						<span className="text-base md:text-lg">🎁🎀</span>
					</h2>
					{/* updates list */}
					<ul className="text-base md:text-2xl flex-wrap">
						<li data-icon="🌈 " className="">
							Added Key Shortcuts
							<ul className="ml-2 md:ml-6">
								<li data-icon="⌨ ">I: Import Image</li>
								<li data-icon="⌨ ">E: Export Image</li>
								<li data-icon="⌨ ">Esc: Close Popups</li>
								<li data-icon="⌨ ">R: Reset</li>
								<li data-icon="⌨ ">
									W: Turn Warp Real Time On/Off
								</li>
							</ul>
						</li>
						<li data-icon="🌈 " className="">
							Added Reset Warning Popup
						</li>

						<li data-icon="☕ " className="">
							<a
								className="border-b-2 border-primary2"
								target="_blank"
								href="https://www.buymeacoffee.com/sandeepchahal"
							>
								Fixed BuyMeACoffee link
							</a>
						</li>
						<li data-icon="🌈 " className="">
							Use + and - to zoom in and out
						</li>

						<li data-icon="🌈 " className="">
							Drag and drop image into editor
						</li>
						<li data-icon="🌈 " className="">
							Copy paste image into editor
						</li>
						<li data-icon="🌈 " className="">
							Resize output images by dragging from corners
						</li>
						<li data-icon="🌈 " className="">
							Zoom in board
						</li>
					</ul>{" "}
					<div className="mb-4 italic">
						Note: The application is in development, please report
						any bug you find or feature you would like to see in the
						future.
					</div>
				</div>
				{/* updates container ends*/}
			</div>
		</div>
	);
}

export default WhatsNew;
