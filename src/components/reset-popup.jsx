import React, { useEffect } from "react";
import WarningSvg from "./svg/warning-svg";

const ResetPopup = ({ close }) => {
	const handleKeyPress = (e) => {
		if (e.key === "Escape") close();
	};

	useEffect(() => {
		window.addEventListener("keydown", handleKeyPress);
		return () => {
			window.removeEventListener("keydown", handleKeyPress);
		};
	}, []);
	return (
		<div className="animate-reveal fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-primary1 py-4 px-5 rounded-md">
				<div className="flex items-center">
					<WarningSvg />
					<div>
						<h2 className="text-3xl">Are you sure?</h2>
						<p className="">This will reload the page!</p>
					</div>
				</div>
				<button
					ref={(ref) => {
						if (ref) {
							ref.focus();
						}
					}}
					onClick={() => window.location.reload()}
					className="bg-primary3 text-primary1 p-2 px-4 w-full mt-6"
				>
					Reset
				</button>
				<button
					onClick={close}
					title="Close (Esc)"
					className="bg-primary2 text-primary2 p-2 px-4 w-full mt-1"
				>
					No
				</button>
			</div>
		</div>
	);
};
export default ResetPopup;
