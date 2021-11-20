import React, { useRef, useEffect, useState } from "react";
import { useStoreState } from "easy-peasy";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

function Editor() {
	const parent = useRef(null);
	const [disabled, setDisabled] = useState(true);
	const canvas = useRef();
	const image = useRef();
	const file = useStoreState((state) => state.file);

	useEffect(() => {
		if (file && canvas.current) {
			const img = new Image();
			img.src = file;
			img.onload = () => {
				image.current = img;
				canvas.current.width = img.width;
				canvas.current.height = img.height;
				canvas.current.getContext("2d").drawImage(image.current, 0, 0);
			};
		}
	}, [file]);
	useEffect(() => {
		const onKeyDown = (e) => {
			if (e.keyCode === 17 && disabled) {
				parent.current.style.cursor = "grab";
				setDisabled(false);
			}
		};
		const onKeyUp = (e) => {
			if (e.keyCode === 17) {
				parent.current.style.cursor = "default";
				setDisabled(true);
			}
		};
		const onWheel = (e) => {
			e.preventDefault();
		};
		if (parent.current) {
			window.addEventListener("keydown", onKeyDown);
			window.addEventListener("keyup", onKeyUp);
			window.addEventListener("wheel", onWheel);
		}
		return () => {
			window.removeEventListener("keydown", onKeyDown);
			window.removeEventListener("keyup", onKeyUp);
			window.removeEventListener("wheel", onWheel);
		};
	}, []);

	return (
		<div ref={parent} className="h-full dot-pattern">
			<TransformWrapper
				minScale={0.1}
				limitToBounds={false}
				disabled={disabled}
			>
				<TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
					<div className="" onClick={() => console.log("drop it")}>
						<canvas ref={canvas} />
					</div>
				</TransformComponent>
			</TransformWrapper>
		</div>
	);
}

export default Editor;
