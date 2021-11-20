import { createStore, action } from "easy-peasy";

export default createStore({
	file: null,
	setFile: action((state, payload) => {
		state.file = payload;
	}),
});
