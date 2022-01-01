import React, { useRef, useEffect } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useMainStore } from "../store";
import DeleteSvg from "../components/svg/delete-svg";
import EmptySvg from "../components/svg/empty-svg";

const Board = () => {
	const { results, setResults } = useMainStore();
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
		const onMouseEnter = () => {
			isMouseOver.current = true;
		};
		const onMouseLeave = () => {
			isMouseOver.current = false;
		};
		if (parentRef.current) {
			parentRef.current.addEventListener("mouseenter", onMouseEnter);
			parentRef.current.addEventListener("mouseleave", onMouseLeave);
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
			if (parentRef.current) {
				parentRef.current.removeEventListener("mouseenter", onMouseEnter);
				parentRef.current.removeEventListener("mouseleave", onMouseLeave);
			}
		};
	}, []);

	return (
		<div className="w-full h-full bg-primary2 text-primary2" ref={parentRef}>
			<div className="flex items-start flex-wrap h-max max-w-full">
				{!resultsArray.length ? (
					<div className="w-full mt-32 flex flex-col items-center justify-center">
						<EmptySvg />
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
											<div onClick={() => handleDeleteResult(key)}>
												<DeleteSvg />
											</div>
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
