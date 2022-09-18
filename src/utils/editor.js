import { uniqueId } from "./index";

function updatePerspectiveGrid(points) {
	// TL -> BL
	const verticalLines1 = getMidPointArray(points[0], points[3]);
	// TR -> BR
	const verticalLines2 = getMidPointArray(points[1], points[2]);
	// TL -> TR
	const horizontalLines1 = getMidPointArray(points[0], points[1]);
	// BR -> BL
	const horizontalLines2 = getMidPointArray(points[3], points[2]);

	const linePoints1 = [...verticalLines1, ...horizontalLines1];
	const linePoints2 = [...verticalLines2, ...horizontalLines2];
}
// get mid point of a line/two points
function midPoint(x1, y1, x2, y2) {
	return [(x1 + x2) / 2, (y1 + y2) / 2];
}

// add new layer
export const getNewLayer = (file, totalLayerCount, editorSettings) => {
	const { width, height } = file;
	const newLayer = {
		name: `Layer ${++totalLayerCount.current}`,
		id: uniqueId(),
		points: [
			{
				x: editorSettings.radius * 2,
				y: editorSettings.radius * 2,
			},
			{
				x: width - editorSettings.radius * 2,
				y: editorSettings.radius * 2,
			},
			{
				x: width - editorSettings.radius * 2,
				y: height - editorSettings.radius * 2,
			},
			{
				x: editorSettings.radius * 2,
				y: height - editorSettings.radius * 2,
			},
		],
	};
	return newLayer;
};

// delete layer
export const handleDeleteLayer = (id) => {
	const keys = Object.keys(layers.current);

	// if there's only one layer then dont delete
	if (keys.length === 1) return;

	delete layers.current[id];
	setResults((state) => {
		const newState = { ...state };
		delete newState[id];
		return newState;
	});
	// if user deleted active layer then set active layer to first layer
	// or to second if first layer is deleted
	if (activeLayer === id) {
		setActiveLayer(keys[keys[0] === id ? 1 : 0]);
	}
};

// draw newly imported image on canvas
export const showImage = (file, opencvImg, activeLayer, handleAddLayer) => {
	const tempCanvas = document.createElement("canvas");
	const tempCanvasCtx = tempCanvas.getContext("2d");

	tempCanvasCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
	tempCanvas.width = file.width;
	tempCanvas.height = file.height;
	tempCanvasCtx.drawImage(file, 0, 0);
	if (window.cv) {
		opencvImg.current = window.cv.imread(tempCanvas);
	}
	if (!activeLayer) handleAddLayer();
};

export const updateResultOpencv = (
	activeLayer,
	layers,
	opencvImg,
	setResults
) => {
	// http://www.recompile.in/2019/11/image-perspective-correction-using.html
	if (!activeLayer || !layers.current[activeLayer]) return;
	if (!window.cv) {
		alert("opencv is not loaded yet");
		return;
	}
	const tempCanvas = document.createElement("canvas");
	const cv = window.cv;

	let points = layers.current[activeLayer].points;

	let width = Math.max(points[1].x - points[0].x, points[2].x - points[3].x);
	let height = Math.max(points[3].y - points[0].y, points[2].y - points[1].y);
	// min height and width must be 200px
	if (width < 200 || height < 200) {
		let diff = Math.max(200 - width, 200 - height);
		width += diff;
		height += diff;
	}
	// flatten the array
	points = [
		points[0].x,
		points[0].y,
		points[1].x,
		points[1].y,
		points[2].x,
		points[2].y,
		points[3].x,
		points[3].y,
	];
	const dstPoints = [0, 0, height, 0, height, width, 0, width];
	let dst = new cv.Mat();
	let dsize = new cv.Size(height, width);
	let srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, points);
	let dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, dstPoints);
	let M = cv.getPerspectiveTransform(srcTri, dstTri);
	cv.warpPerspective(
		opencvImg.current,
		dst,
		M,
		dsize,
		cv.INTER_LINEAR,
		cv.BORDER_CONSTANT,
		new cv.Scalar()
	);

	// get the image data from opencv canvas
	tempCanvas.width = dsize.width;
	tempCanvas.height = dsize.height;
	cv.imshow(tempCanvas, dst);
	const base64 = tempCanvas.toDataURL();

	// update results
	setResults((state) => {
		const newState = { ...state };
		newState[activeLayer] = {
			result: base64,
			width,
			height,
			id: activeLayer,
			name: layers.current[activeLayer].name,
		};
		return newState;
	});

	// cleanup
	dst.delete();
	M.delete();
	srcTri.delete();
	dstTri.delete();
};

export const getMeshLinesPositions = (points) => {
	// calculate vertical lines(3) points
	const verticalPoints = [
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
	];
	// middle vertical line
	const verMidPointFrom = midPoint(
		points[0].x,
		points[0].y,
		points[1].x,
		points[1].y
	);
	const verMidPointTo = midPoint(
		points[3].x,
		points[3].y,
		points[2].x,
		points[2].y
	);
	verticalPoints[1] = [...verMidPointFrom, ...verMidPointTo];

	// left vertical line
	const verLeftPointFrom = midPoint(
		points[0].x,
		points[0].y,
		verticalPoints[1][0],
		verticalPoints[1][1]
	);
	const verLeftPointTo = midPoint(
		points[3].x,
		points[3].y,
		verticalPoints[1][2],
		verticalPoints[1][3]
	);
	verticalPoints[0] = [...verLeftPointFrom, ...verLeftPointTo];

	// right vertical line
	const verRightPointFrom = midPoint(
		verticalPoints[1][0],
		verticalPoints[1][1],
		points[1].x,
		points[1].y
	);
	const verRightPointTo = midPoint(
		verticalPoints[1][2],
		verticalPoints[1][3],
		points[2].x,
		points[2].y
	);
	verticalPoints[2] = [...verRightPointFrom, ...verRightPointTo];

	// calculate horizontal lines(3) points
	const horizontalPoints = [
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
	];
	// middle horizontal line
	const horMidPointFrom = midPoint(
		points[0].x,
		points[0].y,
		points[3].x,
		points[3].y
	);
	const horMidPointTo = midPoint(
		points[1].x,
		points[1].y,
		points[2].x,
		points[2].y
	);
	horizontalPoints[1] = [...horMidPointFrom, ...horMidPointTo];

	// top horizontal line
	const horTopPointFrom = midPoint(
		points[0].x,
		points[0].y,
		horizontalPoints[1][0],
		horizontalPoints[1][1]
	);
	const horTopPointTo = midPoint(
		points[1].x,
		points[1].y,
		horizontalPoints[1][2],
		horizontalPoints[1][3]
	);
	horizontalPoints[0] = [...horTopPointFrom, ...horTopPointTo];

	// bottom horizontal line
	const horBottomPointFrom = midPoint(
		horizontalPoints[1][0],
		horizontalPoints[1][1],
		points[3].x,
		points[3].y
	);
	const horBottomPointTo = midPoint(
		horizontalPoints[1][2],
		horizontalPoints[1][3],
		points[2].x,
		points[2].y
	);
	horizontalPoints[2] = [...horBottomPointFrom, ...horBottomPointTo];

	return [...verticalPoints, ...horizontalPoints];
};
