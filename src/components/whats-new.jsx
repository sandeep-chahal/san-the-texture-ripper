import React, { useRef, useState } from "react";

import { useStore } from "../store";

function WhatsNew() {
	const { setShowWhatsNew } = useStore();

	return (
		<div className="animate-reveal fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center">
			<div
				style={{ width: "90%", height: "90%" }}
				className="relative bg-primary2 text-primary2 flex flex-col overflow-auto"
			>
				<div className="">
					<h1 className="text-center mt-4 text-4xl">What's New</h1>
					<svg
						onClick={() => setShowWhatsNew(false)}
						title="Delete"
						className="absolute top-4 right-4 fill-current inline cursor-pointer text-red-600 text-sm ml-3 transition-opacity transform hover:scale-110"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 30 30"
						width="15px"
						height="15px"
					>
						<path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z" />
					</svg>
				</div>
				<div className="w-4/5 mx-auto mt-4">
					<ul className="text-2xl flex flex-wrap">
						<li className="list-disc mr-4">
							<h2 className="mb-4">Drag and drop image</h2>
							<img className=" mb-8" src="gifs/drag-n-drop.gif" />
						</li>
						<li className="list-disc mr-4">
							<h2 className="mb-4">Copy paste image</h2>
							<img className=" mb-8" src="gifs/copy-paste.gif" />
						</li>
						<li className="list-disc mr-4">
							<h2 className="mb-4">Resize output images</h2>
							<img className=" mb-8" src="gifs/resize.gif" />
						</li>
						<li className="list-disc mr-4">
							<h2 className="mb-4">Zoom in preview</h2>
							<img className=" mb-8" src="gifs/movable.gif" />
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
