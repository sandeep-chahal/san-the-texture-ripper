import React, { useRef, forwardRef, useImperativeHandle } from "react";
import { useStoreState } from "easy-peasy";
import { toPng } from "html-to-image";

const Board = forwardRef((props, ref) => {
	const printComponent = useRef(null);
	const result = useStoreState((state) => state.results);

	const handleExport = () => {
		toPng(printComponent.current)
			.then((dataUrl) => {
				var link = document.createElement("a");
				link.download = "result.png";
				link.href = dataUrl;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			})
			.catch(function (error) {
				console.error("oops, something went wrong!", error);
			});
	};

	useImperativeHandle(ref, () => ({
		handleExport: handleExport,
	}));

	return (
		<div className="w-full h-full overflow-auto">
			<div
				className="flex items-start flex-wrap h-max max-w-full"
				ref={printComponent}
			>
				{Object.values(result).map((data, index) => (
					<img
						style={{
							width: data.width,
							height: data.height,
						}}
						width={data.width}
						height={data.height}
						key={index}
						src={data.result}
					/>
				))}
			</div>
		</div>
	);
});

export default Board;
