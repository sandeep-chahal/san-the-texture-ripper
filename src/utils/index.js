export const readImage = (file) => {
	return new Promise((res) => {
		const reader = new FileReader();
		reader.onload = function (e) {
			const data = e.target.result;
			res(data);
		};
		reader.readAsDataURL(file);
	});
};

export const uniqueId = () => {
	return Math.random().toString(36).substr(2, 9);
};
