module.exports = {
	purge: [],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			fontFamily: {
				squada: "Squada One",
			},
			textColor: {
				primary1: "var(--color-text-primary-1)",
				primary2: "var(--color-text-primary-2)",
			},
			backgroundColor: {
				primary1: "var(--color-bg-primary-1)",
				primary2: "var(--color-bg-primary-2)",
			},
			borderColor: {
				primary1: "var(--color-border-1)",
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
