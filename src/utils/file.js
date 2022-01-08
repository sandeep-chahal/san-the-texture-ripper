export const IMAGE_FORMATS = [
	"image/png",
	"image/jpg",
	"image/jpeg",
	"image/webp",
];

export const readImage = (file) => {
	if (createImageBitmap) {
		console.log("using bitmap");
		return createImageBitmap(file);
	} else
		return new Promise((res) => {
			console.log("using fileReader");
			const reader = new FileReader();
			reader.onload = function (e) {
				const data = e.target.result;
				res(data);
			};
			reader.readAsDataURL(file);
		});
};

export const handleFileChange = async (file, setFile, cb) => {
	try {
		if (IMAGE_FORMATS.includes(file.type)) {
			const data = await readImage(file);
			const ts2 = Date.now();
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
