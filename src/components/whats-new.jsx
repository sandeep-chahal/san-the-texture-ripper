import React, { useEffect } from "react";
import DeleteSvg from "../components/svg/delete-svg";
import { useMainStore } from "../store";

function WhatsNew() {
	const { setShowWhatsNew } = useMainStore();

	const handleKeyPress = (e) => {
		if (e.key === "Escape") setShowWhatsNew(false);
	};

	useEffect(() => {
		window.addEventListener("keydown", handleKeyPress);
		return () => {
			window.removeEventListener("keydown", handleKeyPress);
		};
	}, []);

	return (
		<div className="animate-reveal fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center">
			<div
				style={{ height: "90%" }}
				className="relative bg-primary2 text-primary2 flex flex-col overflow-auto w-11/12 md:w-3/4"
			>
				<div className="">
					<h1 className="text-center mt-4 text-4xl">What's New</h1>
					<div
						className="absolute top-4 right-4"
						onClick={() => setShowWhatsNew(false)}
					>
						<DeleteSvg setShowWhatsNew={setShowWhatsNew} />
					</div>
				</div>
				<div className="w-4/5 mx-auto mt-4">
					<ul className="text-2xl  flex-wrap">
						<li className="list-disc mr-4">
							<h2 className="">Added Key Shortcuts</h2>
							<ul className="flex mb-4 text-xl flex-col md:flex-row">
								<div>
									<li>I: Import Image</li>
									<li>E: Export Image</li>
									<li>R: Reset</li>
									<li>Esc: Close Popups</li>
								</div>
								<div className="md:ml-20">
									<li>W: Turn Warp Real Time On/Off</li>
									<li>N: Create New Layer</li>
									<li>C: Delete Active Layer</li>
								</div>
							</ul>
						</li>
						<li className="list-disc mr-4">
							<h2 className="mb-4">Added Reset Warning Popup</h2>
						</li>
						<li className="h-1 bg-primary3 w-full mb-4"></li>
						<li className="list-disc mr-4">
							<h2 className="mb-4">
								Fixed{" "}
								<a
									className="border-b-2 border-primary1"
									target="_blank"
									href="https://www.buymeacoffee.com/sandeepchahal"
								>
									BuyMeACoffee
								</a>{" "}
								link
							</h2>
						</li>
						<li className="list-disc mr-4">
							<h2 className="mb-4">Use + and - to zoom in and out</h2>
						</li>
						<li className="h-1 bg-primary3 w-full mb-4"></li>
						<li className="list-disc mr-4">
							<h2 className="mb-4">Drag and drop image</h2>
							<img
								className=" mb-8"
								src="https://media2.giphy.com/media/ljQZsb3swigxy7dz2f/giphy.gif"
							/>
						</li>
						<li className="list-disc mr-4">
							<h2 className="mb-4">Copy paste image</h2>
							<img
								className=" mb-8"
								src="https://media1.giphy.com/media/qFKNI3T860FUXfUzd1/giphy.gif"
							/>
						</li>
						<li className="list-disc mr-4">
							<h2 className="mb-4">Resize output images</h2>
							<img
								className=" mb-8"
								src="https://media3.giphy.com/media/0koZYA8HvB92dNaT2J/giphy.gif"
							/>
						</li>
						<li className="list-disc mr-4">
							<h2 className="mb-4">Zoom in preview</h2>
							<img
								className=" mb-8"
								src="https://media3.giphy.com/media/tlc8gDDcNcsDsaSrol/giphy.gif"
							/>
						</li>
					</ul>
					<div className="mb-4">
						Note: The application is still in development, please report any bug
						you find.
					</div>
				</div>
			</div>
		</div>
	);
}

export default WhatsNew;
