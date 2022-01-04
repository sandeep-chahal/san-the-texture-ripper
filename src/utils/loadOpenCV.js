// https://github.com/giacomocerquone/opencv-react/blob/master/src/lib/OpenCvProvider.js
export const LoadOpenCV = (onLoad) => {
	if (document.querySelector("#opencv") || window.cv) {
		onLoad(window.cv);
		return;
	}
	console.log("loading opencv");
	var script = document.createElement("script");
	script.id = "opencv";
	script.src = "opencv.js";
	script.nonce = true;
	script.defer = true;
	script.async = true;
	document.body.appendChild(script);
	script.onload = () => checkCVLoaded(onLoad);
};

const checkCVLoaded = (onLoad) => {
	try {
		const mat = new window.cv.Mat();
		mat.delete();
		onLoad(window.cv);
	} catch (err) {
		setTimeout(() => checkCVLoaded(onLoad), 50);
	}
};

export const gg = (cb) => cb();
