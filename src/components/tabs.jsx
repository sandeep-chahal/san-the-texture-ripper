import React from "react";
import DeleteSvg from "./svg/delete-svg";
import AddSvg from "./svg/add-svg";

const Tabs = ({
	tabs = [],
	activeTab,
	setActiveTab,
	handleDeleteTab,
	addTab,
	activeTabClassName = "",
}) => {
	if (tabs.length === 0) return null;
	return (
		<div className="p-1 px-2 flex items-start text-primary2 bg-primary2 pb-2">
			<div className="flex overflow-x-auto scroll-bar-1">
				{tabs.map((tab, index) => (
					<div
						key={tab.key}
						className={`px-3 group min-w-max relative ${
							activeTab === tab.key
								? `border-b-2 border-primary1 ${activeTabClassName}`
								: ""
						}`}
					>
						<span
							className="cursor-pointer"
							onClick={() => setActiveTab(tab.key)}
						>
							{tab.name}
						</span>
						{/* delete icon */}
						<div
							className="inline-block opacity-0 group-hover:opacity-100"
							onClick={() => handleDeleteTab(tab.key)}
						>
							<DeleteSvg />
						</div>
					</div>
				))}
			</div>
			{/* add icon */}
			<div
				onClick={addTab}
				className="mt-1 flex items-center ml-2 transition-transform transform rotate-0 hover:rotate-90 hover:scale-110"
			>
				<AddSvg />
			</div>
		</div>
	);
};

export default Tabs;
