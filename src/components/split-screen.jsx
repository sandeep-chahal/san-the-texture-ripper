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
			window.addEventListener("blur", onMouseUp);
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
			window.removeEventListener("blur", onMouseUp);
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
				className="w-1 bg-primary3 flex items-center cursor-ew-resize"
				ref={spliter}
			>
				<div className="flex flex-col justify-center items-center w-full">
					{new Array(5).fill(null).map((_, i) => {
						return <span key={i} className="w-full h-1 mt-2 bg-primary1" />;
					})}
				</div>
			</span>
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
