import { createStore, action } from "easy-peasy";

export default createStore({
	file: null,
	setFile: action((state, payload) => {
		state.file = payload;
	}),
	results: {},
	setResult: action((state, payload) => {
		state.results[payload.id] = {
			id: payload.id,
			result: payload.result,
			width: payload.width,
			height: payload.height,
		};
	}),
	removeResult: action((state, payload) => {
		delete state.results[payload.id];
	}),
});
