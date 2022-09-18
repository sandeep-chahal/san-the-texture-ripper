export const IMAGE_FORMATS = [
	"image/png",
	"image/jpg",
	"image/jpeg",
	"image/webp",
];

// polyfill for createBitMap

if (!("createImageBitmap" in window)) {
	window.createImageBitmap = async function (blob) {
		return new Promise((resolve, reject) => {
			let img = document.createElement("img");
			img.addEventListener("load", function () {
				resolve(this);
			});
			img.src = URL.createObjectURL(blob);
		});
	};
}

export const handleFileChange = async (file, setFile, cb) => {
	try {
		if (IMAGE_FORMATS.includes(file.type)) {
			const data = await window.createImageBitmap(file);
			setFile(data);
		} else {
			console.log("FILE TYPE NOT SUPPORTED", file.type);
		}
		// clear the file input
		if (cb) cb();
	} catch (err) {
		console.log(err);
	}
};

export const readFileFromClipboard = (e, setFile) => {
	if (e.clipboardData.items.length > 0) {
		const item = e.clipboardData.items[0];
		if (item.kind === "file") {
			const blob = item.getAsFile();
			handleFileChange(blob, setFile);
		}
	}
};
