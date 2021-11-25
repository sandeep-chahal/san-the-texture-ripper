import React from "react";
import { useStore } from "../store";

const Board = () => {
	const { results } = useStore();

	return (
		<div className="w-full h-full overflow-auto">
			<div className="flex items-start flex-wrap h-max max-w-full">
				{Object.values(results || {}).map((data, index) => (
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
};

export default Board;
