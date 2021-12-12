import React, { useEffect, useState } from "react";
import { useStore } from "../store";

const Header = ({ onExport, handleFileChange }) => {
	const { setFile, warpRealTime, setWarpRealTime, setShowWhatsNew } =
		useStore();
	const [showMore, setShowMore] = useState(false);

	const onDropDown = () => {
		setShowMore((showMore) => !showMore);
	};

	useEffect(() => {
		const handleClick = () => {
			setShowMore(false);
			document.removeEventListener("click", handleClick);
		};
		if (showMore) {
			document.addEventListener("click", handleClick, false);
		}
	}, [showMore]);

	const handleReset = () => {
		window.location.reload();
	};

	return (
		<header className="bg-primary1 text-primary2 p-3 border-b-2 border-primary1 h-16 flex items-center justify-between">
			<h1 className=" font-squada text-3xl flex justify-center">
				<img src="favicon.svg" className="w-8 h-10 mr-3" />
				Sand Ripper
			</h1>
			<ul className="bg-primary1 flex items-center">
				<input
					id="import-files"
					hidden
					type="file"
					accept="image/png, image/jpeg , image/webp"
					onChange={(e) =>
						handleFileChange(e.target.files[0], () => (e.target.value = ""))
					}
				/>
				<li className="w-min-20 px-4 h-full border-l-2 border-primary1">
					<label
						htmlFor="import-files"
						className="cursor-pointer w-full h-full flex items-center justify-center"
					>
						{/* import icon */}
						<svg
							className="fill-current text-primary2 mr-2"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 89.63 122.88"
							width="15px"
							height="15px"
						>
							<path d="M33.27,68.66H7.15a7.23,7.23,0,0,1,0-14.45H33.27l-8.48-9.46a7.25,7.25,0,0,1,.5-10.16,7.07,7.07,0,0,1,10.06.5L54.62,56.61a7.25,7.25,0,0,1-.06,9.72L35.35,87.78a7.07,7.07,0,0,1-10.06.5,7.25,7.25,0,0,1-.5-10.16l8.48-9.46Zm16.25,54.08a7.22,7.22,0,1,1-2.83-14.17l3.39-.67c16.33-3.24,25.1-5.09,25.1-27.69V40.63c0-21-9.34-22.76-24.8-25.65l-3.63-.68A7.21,7.21,0,1,1,49.46.13L53,.81c22.82,4.26,36.6,6.84,36.6,39.82V80.21c0,34.43-12.84,37.11-36.74,41.85l-3.37.68Z"></path>
						</svg>
						Import
					</label>
				</li>
				<li
					onClick={onExport}
					className="w-min-20 px-4 h-full border-l-2 border-primary1 cursor-pointer flex items-center justify-center"
				>
					{/* export icon */}
					<svg
						className="fill-current text-primary2 mr-2"
						xmlns="http://www.w3.org/2000/svg"
						width="15px"
						height="15px"
						viewBox="0 0 122.88 114.318"
					>
						<g>
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M122.88,35.289L87.945,70.578v-17.58c-22.091-4.577-39.542,0.468-52.796,17.271 c2.301-34.558,25.907-51.235,52.795-52.339L87.945,0L122.88,35.289L122.88,35.289z"
							/>
							<path d="M6.908,23.746h35.626c-4.587,3.96-8.71,8.563-12.264,13.815H13.815v62.943h80.603V85.831l13.814-13.579v35.159 c0,3.814-3.093,6.907-6.907,6.907H6.908c-3.815,0-6.908-3.093-6.908-6.907V30.653C0,26.838,3.093,23.746,6.908,23.746L6.908,23.746 z" />
						</g>
					</svg>
					Export
				</li>
				<li
					onClick={() => setWarpRealTime((s) => !s)}
					className="w-min-20 px-4 h-full border-l-2 border-primary1 cursor-pointer flex items-center justify-center"
				>
					{/* engine icon */}
					<svg
						className="fill-current text-primary2 mr-2"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 120.41 122.88"
						width="15px"
						height="15px"
					>
						<title>repair-fix-repairing</title>
						<path d="M19,70.15c-4.75,1-9.66,1.1-14.42-3.79C1.4,63.1-.19,58.23,0,53.13c12.17,14.15,27-3.34,9-12.43,8.69-4.12,16.89-.25,21.24,7.76,2.06,3.78,3.29,5.76,4.86,7.11a8.58,8.58,0,0,0,.9.69A8.1,8.1,0,0,1,39.8,51.8,7.14,7.14,0,0,1,43.05,51c3.18,0,7.14,1.9,7.81,5.14h0a1.61,1.61,0,0,1,.44-.06h2.31a1.5,1.5,0,0,1,.37,0,5.6,5.6,0,0,1,5,4.59,1.65,1.65,0,0,1,.71-.16H62a1.5,1.5,0,0,1,.37,0c3.31.51,4.65,2.55,5.12,5.12l.26,0h2.31a1.5,1.5,0,0,1,.37,0c3.8.59,5.29,3.08,5.87,6.08,7-1.07,14.57-5.27,22,2.33a17.78,17.78,0,0,1,4.57,13.23c-12.17-14.15-27,3.34-9,12.43-7.47,3.54-14.59,1.17-19.2-4.66a30.06,30.06,0,0,1-2.34,4.92c-.38.62-.77,1.26-1.27,2.14a.16.16,0,0,0,0,.07,19.77,19.77,0,0,1-1.3,2h1.6a2.51,2.51,0,0,1,2.5,2.5v13.61a2.51,2.51,0,0,1-2.5,2.5H35.13a2.51,2.51,0,0,1-2.5-2.5V106.77a2.51,2.51,0,0,1,2.5-2.5H36a18,18,0,0,1-.9-3.79L22.64,80.07,22.58,80a22.48,22.48,0,0,1-2.5-4.24,12.37,12.37,0,0,1-1.08-4,10.22,10.22,0,0,1,0-1.57Zm92-33.29a2,2,0,0,0-.37-.74,1.51,1.51,0,0,0-.57-.46,1.61,1.61,0,0,0-.7-.22,2.62,2.62,0,0,0-.76.09l-.06,0-7.36,2.24a3,3,0,0,1-3.63-1.55c-.38-.64-.75-1.27-1.2-2s-1-1.38-1.39-2S94,31,93.4,30.38s-1-1.14-1.69-1.83A3.09,3.09,0,0,1,91.22,25l3.91-7.35a1.63,1.63,0,0,0,.13-1.46,2.07,2.07,0,0,0-.31-.65,1.82,1.82,0,0,0-.61-.49l-9.26-4.93a2.81,2.81,0,0,0-.68-.26,2.72,2.72,0,0,0-.82.11,1.31,1.31,0,0,0-.61.33,1.82,1.82,0,0,0-.49.61l-3.6,6.75a3.13,3.13,0,0,1-3.69,1.52c-.82-.21-1.59-.41-2.27-.55s-1.54-.28-2.36-.39a23.32,23.32,0,0,0-2.4-.19c-.84-.06-1.62,0-2.37-.06a3,3,0,0,1-3-2.18l-2.5-8.1c0-.06,0-.06,0-.1a2.52,2.52,0,0,0-.3-.66,2.09,2.09,0,0,0-1.26-.61,1.94,1.94,0,0,0-.82.11L48,9.48a1.9,1.9,0,0,0-.74.36,1.71,1.71,0,0,0-.47.57,1.5,1.5,0,0,0-.21.71,2.29,2.29,0,0,0,.09.75l0,.05,2.25,7.35a3.08,3.08,0,0,1-1.56,3.64c-.64.37-1.27.74-2,1.2s-1.38.95-2,1.39-1.3,1-1.91,1.54-1.15,1-1.83,1.7a3.1,3.1,0,0,1-3.59.48l-7.34-3.91a1.88,1.88,0,0,0-.75-.23,3.3,3.3,0,0,0-.69.07,1.31,1.31,0,0,0-.61.32,1.75,1.75,0,0,0-.49.62l-.4.74a24.3,24.3,0,0,0-6.73-.35l1.78-3.35a8.61,8.61,0,0,1,2-2.49,8.51,8.51,0,0,1,2.81-1.5,8.08,8.08,0,0,1,3.18-.33,8.57,8.57,0,0,1,3,1l5.43,2.9.4-.33c.7-.61,1.45-1.19,2.2-1.78s1.56-1.18,2.3-1.66l.26-.19-1.5-5.05a7.44,7.44,0,0,1-.33-3.17,7.84,7.84,0,0,1,.92-3.06,7.75,7.75,0,0,1,2-2.46,8.26,8.26,0,0,1,2.82-1.5L56.28.41l0,0A8.58,8.58,0,0,1,59.43,0a7.71,7.71,0,0,1,3.06.92A8.54,8.54,0,0,1,65,3a7.27,7.27,0,0,1,1.39,2.81l1.83,5.88a2.12,2.12,0,0,0,.43,0c.9.05,1.83.16,2.81.25s1.87.28,2.81.46a1,1,0,0,1,.39.1l2.46-4.63a7.84,7.84,0,0,1,4.82-3.92l.06,0a7.71,7.71,0,0,1,3.11-.31,8.44,8.44,0,0,1,3,.89l9.25,4.94a8.58,8.58,0,0,1,2.49,2,7.68,7.68,0,0,1,1.5,2.82,8,8,0,0,1,.33,3.17,8.31,8.31,0,0,1-1,3l-2.9,5.44c.11.11.23.28.34.39.6.71,1.19,1.45,1.77,2.2s1.19,1.56,1.66,2.3l.19.27,5.05-1.51a7.43,7.43,0,0,1,3.17-.32,8,8,0,0,1,3.06.91,7.67,7.67,0,0,1,2.46,2l0,.08a8.26,8.26,0,0,1,1.5,2.82l3,9.91.05,0a8.8,8.8,0,0,1,.35,3.13,7.87,7.87,0,0,1-.92,3.06,8.54,8.54,0,0,1-2,2.46A7.31,7.31,0,0,1,114.63,55l-5.88,1.83c0,.15,0,.32,0,.47,0,.91-.15,1.83-.24,2.71,0,0,0,.11,0,.15A26.84,26.84,0,0,1,108,63l-.07.34,4.67,2.49a7.52,7.52,0,0,1,2.47,2,8,8,0,0,1,1.45,2.79l0,.07a7.66,7.66,0,0,1,.31,3.1,8.25,8.25,0,0,1-.9,3l-.74,1.39-1.32-.71a25.71,25.71,0,0,0-4.34-7.75c-.14-.19-.29-.37-.45-.55a27.07,27.07,0,0,0-7.55-6.25c.09-.37.18-.75.26-1.13.13-.75.28-1.54.37-2.42,0,0,0-.11,0-.15.11-.81.17-1.54.23-2.27s.09-1.59.07-2.37a3,3,0,0,1,2.18-3l8.09-2.5s.07,0,.11,0a2.31,2.31,0,0,0,.65-.3,1.52,1.52,0,0,0,.41-.55,1.77,1.77,0,0,0,.21-.71,1.94,1.94,0,0,0-.11-.82L111,36.8l0,.06Zm-34-3.09a21.79,21.79,0,0,1,3.93,2.64,23.11,23.11,0,0,1,3.3,3.33,29.87,29.87,0,0,1,2.5,3.79,21.32,21.32,0,0,1,1.72,4.13,20.05,20.05,0,0,1,.86,4.44,20.89,20.89,0,0,1,0,4.54c0,.11,0,.19,0,.26a23,23,0,0,1-.68,3.77c-1.64.16-3.27.42-4.88.71l-1.48-.79c.13-.34.24-.69.35-1.05a18.63,18.63,0,0,0,.64-3.14.8.8,0,0,1,0-.22,17.14,17.14,0,0,0,0-3.44,17.56,17.56,0,0,0-.62-3.23,14.89,14.89,0,0,0-1.28-3,18.34,18.34,0,0,0-1.91-2.87A16.74,16.74,0,0,0,77,41.19a18.31,18.31,0,0,0-6.2-3.3,18.63,18.63,0,0,0-3.14-.64.57.57,0,0,1-.22,0,18.76,18.76,0,0,0-3.44,0,17.57,17.57,0,0,0-3.23.63,14.89,14.89,0,0,0-3,1.28,18.26,18.26,0,0,0-2.87,1.9,17.35,17.35,0,0,0-2.43,2.42c-.23.27-.46.56-.68.87l-5.46-2.91a20.4,20.4,0,0,1,1.42-1.9A22.63,22.63,0,0,1,51,36.26a28.91,28.91,0,0,1,3.79-2.51A24.63,24.63,0,0,1,59,32a22,22,0,0,1,4.39-.88,21.63,21.63,0,0,1,4.55,0c.1,0,.19.05.25,0a23.26,23.26,0,0,1,4.35.84,26.43,26.43,0,0,1,4.39,1.79l0,0Zm-37.89,24h0v.1h0l0,0V58h0v.21h0v.11h0v.11h0v.34h0V59h0v.12h0v.23h0v.13h0v.13h0V60h0v.13h0v.14h0v.25h0V79a1.68,1.68,0,1,1-3.35,0v-3.1h0a1.84,1.84,0,0,1-.25-.17L31.8,73.16l-4.34-3.57A6.52,6.52,0,0,0,26,68.66H24.87a2.57,2.57,0,0,0-1.45.06,1.46,1.46,0,0,0-.79.81h-.1a5.44,5.44,0,0,0-.2,2.11,8.87,8.87,0,0,0,.81,2.9A18.68,18.68,0,0,0,25.26,78s.07.1.1.16l12.7,20.76a1.68,1.68,0,0,1,.28.76h0a11.41,11.41,0,0,0,1.31,4.59H65a11,11,0,0,0,3.08-3.63.47.47,0,0,1,.06-.09c.36-.62.84-1.41,1.31-2.18a29.64,29.64,0,0,0,2.86-6.82v0l0-.06,0-.1,0-.06v0l0-.1,0-.07v0l0-.1.06-.2,0-.1h0l0-.09,0-.1v0l0-.07,0-.1v-.1l0-.1V90l0-.1,0-.09h0l0-.1,0-.1h0l0-.08,0-.1v0l0-.07,0-.1v-.1l0-.1,0-.07v0l0-.1,0-.08v0l0-.09,0-.1h0l0-.09,0-.1v-.1l0-.09v-.29l0-.1v-.1l0-.09v-.1h0v-.09l0-.1v-.84h0v-1l-.13-5.7a1.94,1.94,0,0,1,0-.24c0-.08,0-.62,0-1.34v-.18h0V76.84h0v-.19h0V75.36h0v-.19h0V74.1h0v-.17h0v-.18h0v-.19l0-.09v-.64l0-.08,0-.09,0-.09h0v-.09l0-.07h0l0-.09v-.08l0-.09V72a3.67,3.67,0,0,0-2.89-3H67.74c0,.47,0,.93,0,1.4h0v0h0v0h0v0h0v.1h0v0h0v.08h0V71h0v0h0v0h0v.1h0v0h0v0h0v0h0v.07h0v0h0v0h0v0h0v0h0v.05h0v0h0v0h0v0h0v0h0v.05h0v0h0v0h0v0h0v0h0v0h0v0h0v0h0v.05c-.06.93-.11,1.84-.11,2.7a1.68,1.68,0,0,1-3.36,0c0-.86.07-1.86.13-2.9v-.33h0v-.17h0v-.15h0v-.33h0v-.17h0v-.15h0v-.17h0V70.2h0v-.34h0v-.33h0V69.2h0V69c0-2.52-.45-4.71-2.48-5.08H59.7a1.37,1.37,0,0,1-.36,0c0,.94,0,1.92-.08,2.87v1c-.06.93-.11,1.83-.11,2.69a1.68,1.68,0,1,1-3.36,0c0-.86.07-1.86.13-2.9v-.17h0v-.15h0v-.16h0v-.17h0v-.17h0v-.17h0v-.32h0v-.16h0v-.17h0v-.14h0v-.17h0v-.17h0v-.07c.08-2.84-.23-5.46-2.47-5.87H51.29a1.49,1.49,0,0,1-.43-.06v6.49a1.68,1.68,0,0,1-3.36,0v-8.2c0-2.32-2.3-3.32-4.45-3.32a3.85,3.85,0,0,0-1.74.42,5,5,0,0,0-2.26,3ZM35.29,70l-1.58-.65a19.89,19.89,0,0,0-2.2-.75l2.41,2,1.37,1.12V70Z"></path>
					</svg>
					Warp Real Time
					<span
						className={`${
							warpRealTime ? "bg-green-600" : "bg-primary2"
						} w-3 h-3 ml-3 rounded-full`}
					></span>
				</li>
				<li
					onClick={handleReset}
					className="w-min-20 px-4 h-full border-l-2 border-primary1 cursor-pointer flex items-center justify-center"
				>
					{/* reset icon */}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 122.88 118.66"
						width="15px"
						height="15px"
						className="fill-current text-primary2 mr-2"
					>
						<g>
							<path d="M106.2,22.2c1.78,2.21,3.43,4.55,5.06,7.46c5.99,10.64,8.52,22.73,7.49,34.54c-1.01,11.54-5.43,22.83-13.37,32.27 c-2.85,3.39-5.91,6.38-9.13,8.97c-11.11,8.93-24.28,13.34-37.41,13.22c-13.13-0.13-26.21-4.78-37.14-13.98 c-3.19-2.68-6.18-5.73-8.91-9.13C6.38,87.59,2.26,78.26,0.71,68.41c-1.53-9.67-0.59-19.83,3.07-29.66 c3.49-9.35,8.82-17.68,15.78-24.21C26.18,8.33,34.29,3.76,43.68,1.48c2.94-0.71,5.94-1.18,8.99-1.37c3.06-0.2,6.19-0.13,9.4,0.22 c2.01,0.22,3.46,2.03,3.24,4.04c-0.22,2.01-2.03,3.46-4.04,3.24c-2.78-0.31-5.49-0.37-8.14-0.2c-2.65,0.17-5.23,0.57-7.73,1.17 c-8.11,1.96-15.1,5.91-20.84,11.29C18.43,25.63,13.72,33,10.62,41.3c-3.21,8.61-4.04,17.51-2.7,25.96 c1.36,8.59,4.96,16.74,10.55,23.7c2.47,3.07,5.12,5.78,7.91,8.13c9.59,8.07,21.03,12.15,32.5,12.26c11.47,0.11,23-3.76,32.76-11.61 c2.9-2.33,5.62-4.98,8.13-7.97c6.92-8.22,10.77-18.09,11.66-28.2c0.91-10.37-1.32-20.99-6.57-30.33c-1.59-2.82-3.21-5.07-5.01-7.24 l-0.53,14.7c-0.07,2.02-1.76,3.6-3.78,3.52c-2.02-0.07-3.6-1.76-3.52-3.78l0.85-23.42c0.07-2.02,1.76-3.6,3.78-3.52 c0.13,0,0.25,0.02,0.37,0.03l0,0l22.7,3.19c2,0.28,3.4,2.12,3.12,4.13c-0.28,2-2.12,3.4-4.13,3.12L106.2,22.2L106.2,22.2z"></path>
						</g>
					</svg>
					Reset
				</li>

				<li
					onClick={onDropDown}
					className="relative w-min-20 px-4 h-full border-l-2 border-primary1 cursor-pointer flex justify-center items-center"
				>
					{/* mail icon */}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						version="1.1"
						width="15px"
						height="15px"
						viewBox="0 0 330 330"
						className="fill-current text-primary2 mr-2"
					>
						<path d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393  c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393  s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z" />
					</svg>
					More
					{/* dropdown */}
					{showMore ? (
						<ul className="absolute w-48 bg-primary2 top-full right-0 border-2 border-primary1 z-50">
							<li>
								{/* coffee icon */}
								<a
									className="p-2 border-b-2 border-primary1 bg-primary3 text-primary1 cursor-pointer flex items-center"
									href="https://www.buymeacoffee.com/sandeepchahal"
									target="_blank"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										version="1.1"
										viewBox="0 0 112.24 122.88"
										width="15px"
										height="15px"
										className="fill-current text-primary1 mr-2"
									>
										<g>
											<path d="M84.81,0.03c2.37,0,1.98,0,2.08,0c7.43-0.05,11.68-0.08,15.72,5.63c0.05,0.06,0.09,0.12,0.13,0.18l7.36,11.36 c0.06,0.09,0.12,0.18,0.17,0.27c0.03,0.04,0.05,0.07,0.08,0.11c0.8,1.19,1.88,2.83,1.88,4.55c0,2.3-1.21,3.97-4.85,3.97h-4.3 l-9.89,75.66c-0.12,0.89-0.21,1.83-0.3,2.8c-0.5,5.11-1.05,10.74-5.15,14.46c-4.51,4.1-11.19,3.94-16.92,3.8 c-0.73-0.02-1.43-0.03-2.68-0.03H34.95v-0.01c-5.03,0.14-8.92-1.14-11.69-3.83l-0.13-0.12c-0.04-0.04-0.08-0.08-0.13-0.13 c-0.04-0.04-0.08-0.09-0.12-0.13l-0.12-0.13l-0.12-0.13l-0.12-0.13c-0.04-0.05-0.08-0.09-0.12-0.14l-0.11-0.14l-0.11-0.14 l-0.11-0.14l-0.11-0.14l-0.11-0.14l-0.11-0.15l-0.1-0.15l-0.1-0.15l-0.1-0.15l-0.1-0.15l-0.1-0.16l0,0l-0.09-0.16l-0.09-0.16 l-0.09-0.16h0l-0.09-0.16l-0.09-0.16l-0.09-0.17l-0.08-0.17l-0.08-0.17l0,0l-0.08-0.17l-0.08-0.17l-0.08-0.18l-0.07-0.18l0,0 l-0.07-0.18l-0.07-0.18l-0.07-0.18l-0.07-0.18l-0.07-0.19l-0.06-0.19l0,0l-0.06-0.19l-0.06-0.19l-0.06-0.19l-0.06-0.19h0l-0.05-0.2 l-0.05-0.2h0l-0.05-0.2h0l-0.05-0.2h0l-0.05-0.2l-0.05-0.21h0l-0.04-0.21h0l-0.04-0.21l-0.04-0.21h0l-0.04-0.21h0l-0.04-0.21 l-0.04-0.22h0l-0.03-0.22h0l-0.03-0.22h0l-0.03-0.22l0,0l-0.03-0.22h0l-0.03-0.22l-0.02-0.23l0,0l-0.02-0.23l-0.02-0.23l-0.02-0.23 l-0.02-0.23l-0.02-0.23l-0.01-0.24l-1.42-10.89c-0.03-0.14-0.05-0.29-0.06-0.44L8.14,26.1H4.82C1.23,26.1,0,24.41,0,22.02 c0-1.98,1.4-4.07,2.39-5.53c0.21-0.32,0.4-0.6,0.47-0.71l4.97-8.19c4.66-7.68,5.86-7.67,14.4-7.57c0.42,0,0.87,0.01,2.91,0.01 C45.06,0.03,64.9,0.03,84.81,0.03L84.81,0.03z M97.71,26.14h-84.2l8.77,67.11h66.66L97.71,26.14L97.71,26.14z M22.98,98.59 l1.07,8.22c0.01,0.07,0.02,0.14,0.02,0.21h0c0.19,3.72,1.15,6.44,2.9,8.13c1.71,1.65,4.33,2.43,7.89,2.32l0.08,0v-0.01h33.19 c0.49,0,1.63,0.03,2.81,0.05c4.74,0.11,10.27,0.24,13.21-2.43c2.59-2.36,3.04-6.9,3.44-11.02c0.1-1.02,0.2-2.02,0.32-2.99 l0.32-2.48H22.98L22.98,98.59z" />
										</g>
									</svg>
									Buy me a coffee
								</a>
							</li>
							<li>
								{/* mail icon */}
								<a
									className="p-2 border-b-2 border-primary1 cursor-pointer flex items-center"
									href="mailto: 6sandripper9@gmail.com"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										id="Layer_1"
										width="15px"
										height="15px"
										viewBox="0 0 122.88 88.86"
										className="fill-current text-primary2 mr-2"
									>
										<title>email</title>
										<path d="M7.05,0H115.83a7.07,7.07,0,0,1,7,7.05V81.81a7,7,0,0,1-1.22,4,2.78,2.78,0,0,1-.66,1,2.62,2.62,0,0,1-.66.46,7,7,0,0,1-4.51,1.65H7.05a7.07,7.07,0,0,1-7-7V7.05A7.07,7.07,0,0,1,7.05,0Zm-.3,78.84L43.53,40.62,6.75,9.54v69.3ZM49.07,45.39,9.77,83.45h103L75.22,45.39l-11,9.21h0a2.7,2.7,0,0,1-3.45,0L49.07,45.39Zm31.6-4.84,35.46,38.6V9.2L80.67,40.55ZM10.21,5.41,62.39,47.7,112.27,5.41Z" />
									</svg>
									Contact
								</a>
							</li>
							<li>
								{/* install icon */}
								<a
									className="p-2 border-b-2 border-primary1 cursor-pointer flex items-center"
									href="https://support.google.com/chrome/answer/9658361"
									target="_blank"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="15px"
										height="15px"
										className="fill-current text-primary2 mr-2"
										viewBox="0 0 122.876 107.16"
									>
										<g>
											<path
												fill-rule="evenodd"
												clip-rule="evenodd"
												d="M32.716,32.108h16.566V0l23.702,0v32.107l17.176,0l-28.7,30.32L32.716,32.108 L32.716,32.108z M113.705,32.244l7.733,34.271c0.021,0.071,0.034,0.146,0.044,0.223c0.678,5.731,1.177,10.726,1.338,15.138 c0.164,4.449-0.023,8.255-0.726,11.545c-0.014,0.063-0.03,0.123-0.052,0.183c-0.647,7.566-7.043,13.558-14.77,13.558h-92.12 c-7.736,0-14.138-6.006-14.772-13.585c-0.021-0.094-0.032-0.19-0.034-0.29l-0.012-0.533l-0.002-0.079 c-0.031-1.248-0.076-2.625-0.123-4.06c-0.181-5.508-0.39-11.875,0.058-17.388l-0.016,0.021l0.093-0.892 c0.027-0.294,0.059-0.584,0.091-0.872l7.736-37.239h10.213l-1.297,41.397h88.252l-0.849-41.397H113.705L113.705,32.244z M93.92,84.625c3.247,0,5.879,2.633,5.879,5.879c0,3.247-2.632,5.879-5.879,5.879s-5.879-2.632-5.879-5.879 C88.041,87.258,90.673,84.625,93.92,84.625L93.92,84.625z M17.253,85.941h22.783v8.092H17.253V85.941L17.253,85.941z"
											/>
										</g>
									</svg>
									How to Install
								</a>
							</li>
							<li
								onClick={() => setShowWhatsNew(true)}
								className="p-2 cursor-pointer flex items-center"
							>
								{/* whatsnew icon */}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="15px"
									height="15px"
									className="fill-current text-primary2 mr-2"
									viewBox="0 0 103.68 122.88"
								>
									<path d="M50.67,81.17,15.21,62.53,5.81,73.89c12.58,6.65,24.91,13.31,37.5,20l7.36-12.68ZM23.06,15.3h.25A7.22,7.22,0,0,1,25.56,10a7.22,7.22,0,0,1,5.27-2.25V7.53a7.19,7.19,0,0,1-5.27-2.26A7.26,7.26,0,0,1,23.31,0h-.25a7.22,7.22,0,0,1-2.25,5.27,7.22,7.22,0,0,1-5.28,2.26v.24A7.26,7.26,0,0,1,20.81,10a7.22,7.22,0,0,1,2.25,5.27Zm10.53,4.36h.11a3.62,3.62,0,0,1,3.53-3.53V16A3.4,3.4,0,0,1,34.76,15a3.42,3.42,0,0,1-1.06-2.47h-.11A3.38,3.38,0,0,1,32.53,15,3.36,3.36,0,0,1,30.06,16v.12a3.6,3.6,0,0,1,3.53,3.52Zm-20,7.72h.2A6.07,6.07,0,0,1,15.7,23a6.09,6.09,0,0,1,4.43-1.89v-.21A6.09,6.09,0,0,1,15.7,19a6.09,6.09,0,0,1-1.89-4.43h-.2A6.08,6.08,0,0,1,11.71,19a6,6,0,0,1-4.42,1.89v.21A6.07,6.07,0,0,1,11.71,23a6.08,6.08,0,0,1,1.9,4.43Zm68.6-12H82a7.23,7.23,0,0,0-2.26-5.27,7.22,7.22,0,0,0-5.27-2.25V7.57a7.19,7.19,0,0,0,5.27-2.26A7.27,7.27,0,0,0,82,0h.24a7.19,7.19,0,0,0,2.26,5.27,7.19,7.19,0,0,0,5.27,2.26v.24a7.23,7.23,0,0,0-5.27,2.26,7.19,7.19,0,0,0-2.26,5.27ZM71.68,19.7h-.11A3.62,3.62,0,0,0,68,16.17v-.11A3.4,3.4,0,0,0,70.51,15a3.36,3.36,0,0,0,1.06-2.46h.11A3.38,3.38,0,0,0,72.74,15a3.38,3.38,0,0,0,2.47,1.06v.12a3.6,3.6,0,0,0-3.53,3.52Zm20,7.09h-.19a5.84,5.84,0,0,0-5.7-5.7V20.9a5.45,5.45,0,0,0,4-1.71,5.47,5.47,0,0,0,1.71-4h.19a5.5,5.5,0,0,0,1.7,4,5.5,5.5,0,0,0,4,1.7v.19a5.83,5.83,0,0,0-5.69,5.7ZM53.1,11l6.72,15.69,17.05,1.53a1.36,1.36,0,0,1,1.26,1.36,1.35,1.35,0,0,1-.48,1h0L64.74,41.86l3.81,16.68a1.53,1.53,0,0,1,0,.3,1.35,1.35,0,0,1-1.06,1.33l-.29,0a1.41,1.41,0,0,1-.77-.22L51.81,51.24,37.13,60a1.36,1.36,0,0,1-1.88-.47,1.32,1.32,0,0,1-.19-.7,1.63,1.63,0,0,1,0-.31h0l3.82-16.68L26,30.61a1.33,1.33,0,0,1,.85-2.36l17-1.52L50.56,11a1.39,1.39,0,0,1,2.54,0ZM28.83,55.44l-11,5.46,34.7,18.23L87.28,60.86,74.53,54.19l-.79-3.46,14.81,7.61L99.48,48,80.14,37.48l2-1.73,0,0,.31-.29L103,46.31a1.27,1.27,0,0,1,.33.24,1.34,1.34,0,0,1,0,1.88l-12,11.74L102.9,74a1.32,1.32,0,0,1-.17,1.87,1.27,1.27,0,0,1-.27.18L92.08,81.56v20.59a1.35,1.35,0,0,1-.83,1.23L53.7,122.44a1.35,1.35,0,0,1-1,.44,1.33,1.33,0,0,1-1.19-.74l-37.63-18.8a1.35,1.35,0,0,1-.73-1.19V81.66L2.57,76.07a2.11,2.11,0,0,1-.27-.18A1.33,1.33,0,0,1,2.13,74L13.4,60.53.33,48.14a1.33,1.33,0,0,1,.12-1.88,2,2,0,0,1,.26-.18L20.63,34.81a8,8,0,0,0,.85.89h0L23,37,4,47.8l11.9,11L29.61,52l-.78,3.44Zm61,7.09L54.37,81.17,61.8,94,99.07,73.73l-9.24-11.2Z" />
								</svg>
								Whats New
							</li>
						</ul>
					) : null}
				</li>
			</ul>
		</header>
	);
};
export default Header;
