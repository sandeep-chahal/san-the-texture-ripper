import React from "react";

function ActionBar() {
	return (
		<div className="absolute w-full h-16 bottom-12 flex justify-center ">
			<ul className="w-2/4 h-full bg-primary2 border-4 border-primary1 rounded-2xl flex items-center overflow-hidden">
				<input
					id="import-files"
					hidden
					type="file"
					// multiple
					accept="image/png, image/jpeg , image/webp"
				/>
				<li className="w-20 h-full border-r-4 border-primary1">
					<label
						htmlFor="import-files"
						className="cursor-pointer w-full h-full flex items-center justify-center"
					>
						Import
					</label>
				</li>
			</ul>
		</div>
	);
}

export default ActionBar;
