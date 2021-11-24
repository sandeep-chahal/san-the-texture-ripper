export const readImage = (file) => {
	return new Promise((res) => {
		console.log("reading file");
		const reader = new FileReader();
		reader.onload = function (e) {
			console.log("file read");
			const data = e.target.result;
			res(data);
		};
		reader.readAsDataURL(file);
	});
};
