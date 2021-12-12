import React, { useRef, useEffect } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useStore } from "../store";

const Board = () => {
	const { results, setResults } = useStore();
	const parentRef = useRef(null);
	const wrapperRef = useRef(null);
	const isMouseOver = useRef(null);

	const resultsArray = Object.values(results || {});

	const handleDeleteResult = (key) => {
		setResults((results) => {
			const newResults = { ...results };
			delete newResults[key];
			return newResults;
		});
	};

	useEffect(() => {
		if (parentRef.current) {
			parentRef.current.addEventListener("mouseenter", (e) => {
				// console.log("Mouse Entered");
				isMouseOver.current = true;
			});
			parentRef.current.addEventListener("mouseleave", (e) => {
				// console.log("Mouse Left");
				isMouseOver.current = false;
			});
		}
		const onKeyDown = (e) => {
			if (isMouseOver.current && e.keyCode === 107) {
				// console.log("zoom in");
				wrapperRef.current.zoomIn();
			} else if (isMouseOver.current && e.keyCode === 109) {
				// console.log("zoom out");
				wrapperRef.current.zoomOut();
			}
		};

		window.addEventListener("keydown", onKeyDown);
		return () => {
			window.removeEventListener("keydown", onKeyDown);
			window.removeEventListener("keyup", onKeyUp);
		};
	}, []);

	return (
		<div
			className="w-full h-full overflow-auto bg-primary2 text-primary2"
			ref={parentRef}
		>
			<div className="flex items-start flex-wrap h-max max-w-full">
				{!resultsArray.length ? (
					<div className="w-full mt-32 flex flex-col items-center justify-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 122.88 117.85"
							width="200px"
							height="200px"
							className="fill-current text-primary2"
						>
							<g>
								<path d="M60.05,68.41L18.02,46.33L6.2,60.47c14.91,7.88,29.82,15.76,44.74,23.65L60.05,68.41L60.05,68.41z M63.3,23.47L21.12,44.39 L62.24,66l41.2-21.65L79.81,31.99L63.3,23.47L63.3,23.47z M15.89,43.95L0.39,29.27c-0.57-0.65-0.51-1.65,0.15-2.23 c0.09-0.08,0.2-0.15,0.3-0.21L47.95,0.18c0.75-0.4,1.68-0.12,2.1,0.61l13.23,18.22L72.1,2.49c0.41-0.77,1.36-1.07,2.13-0.66 l47.8,25.27c0.14,0.08,0.27,0.17,0.39,0.29c0.61,0.62,0.6,1.62-0.02,2.23l-14.16,13.91l13.71,16.41c0.56,0.67,0.47,1.67-0.2,2.22 c-0.1,0.08-0.21,0.15-0.32,0.21l-12.31,6.51v24.4c0,0.66-0.4,1.22-0.98,1.46l-44.51,22.59c-0.29,0.32-0.71,0.52-1.17,0.52 c-0.62,0-1.15-0.35-1.41-0.87l-44.59-22.3c-0.55-0.28-0.87-0.83-0.87-1.41L15.59,69L3.05,62.37c-0.11-0.06-0.22-0.13-0.32-0.21 c-0.67-0.56-0.76-1.56-0.2-2.22L15.89,43.95L15.89,43.95z M60.84,21.06L48.11,3.67L4.07,28.7L18.46,42.1L60.84,21.06L60.84,21.06z M65.75,21.08l14.75,7.72l25.08,12.93l13.07-12.84L74.15,5.35L65.75,21.08L65.75,21.08z M106.47,46.33L64.44,68.41l9.11,15.7 l44.74-23.65L106.47,46.33L106.47,46.33z"></path>
							</g>
						</svg>
						<p>No Results Yet</p>
						<p>Import a image file to get started</p>
					</div>
				) : (
					<TransformWrapper
						minScale={0.1}
						limitToBounds={false}
						ref={wrapperRef}
					>
						<TransformComponent
							wrapperStyle={{ width: "100%", height: "100%" }}
							contentClass="w-full min-h-screen"
						>
							<div className="max-w-full flex flex-wrap h-full">
								{Object.keys(results).map((key, index) => (
									<div
										className="group relative m-2"
										key={key}
										style={{
											width: results[key].width,
											height: results[key].height,
										}}
									>
										<img
											style={{
												width: results[key].width,
												height: results[key].height,
											}}
											width={results[key].width}
											height={results[key].height}
											key={index}
											src={results[key].result}
											className="inline-block"
										/>

										<div className="opacity-0 group-hover:opacity-100 absolute top-0 left-0 flex items-center justify-between w-full bg-black bg-opacity-60 py-1 px-2">
											<h2 className="">{results[key].name}</h2>
											<svg
												title="Delete"
												onClick={() => handleDeleteResult(key)}
												className="fill-current inline cursor-pointer text-red-600 text-sm ml-3 opacity-0 group-hover:opacity-100 transition-opacity transform hover:scale-110"
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 30 30"
												width="15px"
												height="15px"
											>
												<path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z" />
											</svg>
										</div>
									</div>
								))}
							</div>
						</TransformComponent>
					</TransformWrapper>
				)}
			</div>
		</div>
	);
};

export default Board;
