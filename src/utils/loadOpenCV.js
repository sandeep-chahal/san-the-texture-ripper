// https://github.com/giacomocerquone/opencv-react/blob/master/src/lib/OpenCvProvider.js
export const LoadOpenCV = (onLoad, onError) => {
	if (document.querySelector("#opencv") || window.cv) {
		onLoad(window.cv);
		return;
	}
	console.log("loading opencv");
	const script = document.createElement("script");
	script.id = "opencv";
	script.src = "opencv.js";
	script.nonce = true;
	script.defer = true;
	script.async = true;
	document.body.appendChild(script);
	script.onload = () => checkCVLoaded(onLoad, onError);
	script.onerror = () => handleOnError(onError);
};

const handleOnError = (onError) => {
	const script = document.querySelector("#opencv");
	if (script) script.remove();
	onError();
};

const checkCVLoaded = (onLoad, onError) => {
	try {
		const mat = new window.cv.Mat();
		mat.delete();
		onLoad(window.cv);
	} catch (err) {
		if (!window.cv) {
			handleOnError(onError);
			return;
		}
		setTimeout(() => checkCVLoaded(onLoad), 50);
	}
};
