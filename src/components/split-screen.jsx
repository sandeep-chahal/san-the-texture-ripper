import React, { useEffect, useRef, useState } from "react";

function SplitScreen({
	children,
	limit = 100,
	type = "vertical",
	width,
	height,
}) {
	const isVertical = type === "vertical";
	const [slide, setSlide] = useState((isVertical ? width : height) / 2);
	const splitter = useRef(null);

	useEffect(() => {
		const onDrag = (e) => {
			e.preventDefault();
			let x, y;
			if (e.type === "touchmove") {
				x = e.touches[0].clientX;
				y = e.touches[0].clientY;
			} else if (e.type === "mousemove") {
				x = e.x;
				y = e.y;
			}

			if (
				x < limit ||
				x > width - limit ||
				y < limit ||
				y > height - limit
			)
				return;
			if (isVertical) setSlide(x);
			else setSlide(y - 60);
		};
		const listenForDrag = (e) => {
			document.body.style.cursor = isVertical ? "ew-resize" : "ns-resize";
			window.addEventListener("mousemove", onDrag);
			window.addEventListener("touchmove", onDrag);
			window.addEventListener("mouseup", onMouseUp);
			window.addEventListener("touchend", onMouseUp);
			window.addEventListener("blur", onMouseUp);
		};
		const onMouseUp = (e) => {
			document.body.style.cursor = "default";
			window.removeEventListener("mousemove", onDrag);
			window.removeEventListener("touchmove", onDrag);
			window.removeEventListener("mouseup", onMouseUp);
			window.removeEventListener("touchend", onMouseUp);
			window.removeEventListener("blur", onMouseUp);
		};
		if (splitter.current) {
			splitter.current.addEventListener("mousedown", listenForDrag);
			splitter.current.addEventListener("touchstart", listenForDrag);
		}
		return () => {
			splitter.current.removeEventListener("mousedown", listenForDrag);
			splitter.current.removeEventListener("touchstart", listenForDrag);
			splitter.current.removeEventListener("mouseup", onMouseUp);
			splitter.current.removeEventListener("touchend", onMouseUp);
			window.removeEventListener("mousemove", onDrag);
			window.removeEventListener("blur", onMouseUp);
		};
	}, [width, isVertical]);
	return (
		<div
			style={{
				touchAction: "none",
			}}
			className={` flex h-full w-full ${
				isVertical ? "flex-row" : "flex-col"
			}`}
		>
			<div
				className="overflow-hidden"
				style={{
					width: isVertical ? slide : "100vw",
					height: isVertical ? "100%" : slide + "px",
				}}
			>
				{children[0]}
			</div>
			<div
				className={`${
					isVertical ? "w-1 cursor-ew-resize" : "h-4 cursor-ns-resize"
				} bg-primary3 flex items-center `}
				ref={splitter}
			>
				<div
					className={`flex ${
						isVertical ? "flex-col" : "flex-row"
					} justify-center items-center w-full overflow-hidden`}
				>
					{new Array(5).fill(null).map((_, i) => {
						if (isVertical)
							return (
								<span
									key={i}
									className="w-full h-1 mt-2 bg-primary1"
								/>
							);
						else
							return (
								<span
									key={i}
									style={{ height: "5px" }}
									className="w-1 ml-2 bg-primary1"
								/>
							);
					})}
				</div>
			</div>
			<div
				style={{
					width: isVertical ? width - slide + "px" : "100vw",
					height: isVertical ? "100%" : height - slide + "px",
				}}
			>
				{children[1]}
			</div>
		</div>
	);
}

export default SplitScreen;
