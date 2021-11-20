export const readImage = (file) =>
	new Promise((res) => {
		const reader = new FileReader();
		reader.onload = function (e) {
			const data = e.target.result;
			res(data);
		};
		reader.readAsDataURL(file);
	});
