import React, { useEffect, useRef, useState } from "react";
import useWindiwSize from "../hooks/useWIndowSize";

function SplitScreen({ children, limit = 100 }) {
	const { width, height } = useWindiwSize();
	const [slide, setSlide] = useState(width / 2);
	const spliter = useRef(null);

	useEffect(() => {
		const onDrag = (e) => {
			if (e.x < limit || e.x > width - limit) return;
			setSlide(e.x);
		};
		const listenForDrag = (e) => {
			console.log("mouse down");
			document.body.style.cursor = "ew-resize";
			window.addEventListener("mousemove", onDrag);
			window.addEventListener("mouseup", onMouseUp);
		};
		const onMouseUp = (e) => {
			console.log("mouse up");
			document.body.style.cursor = "default";
			window.removeEventListener("mousemove", onDrag);
			window.removeEventListener("mouseup", onMouseUp);
		};
		if (spliter.current) {
			spliter.current.addEventListener("mousedown", listenForDrag);
		}
		return () => {
			spliter.current.removeEventListener("mousedown", listenForDrag);
			spliter.current.removeEventListener("mouseup", onMouseUp);
			window.removeEventListener("mousemove", onDrag);
		};
	}, [width]);
	return (
		<div className={`flex h-full flex-row`}>
			<div
				style={{
					width: `${slide}px`,
				}}
			>
				{children[0]}
			</div>
			<span
				className="w-2 bg-secondary1 flex items-center cursor-ew-resize"
				ref={spliter}
			></span>
			<div
				style={{
					width: `${width - slide}px`,
				}}
			>
				{children[1]}
			</div>
		</div>
	);
}

export default SplitScreen;
