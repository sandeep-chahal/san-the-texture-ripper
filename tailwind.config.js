module.exports = {
	purge: ["./src/**/*.jsx"],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			fontFamily: {
				squada: "Squada One",
			},
			textColor: {
				primary1: "var(--color-text-primary-1)",
				primary2: "var(--color-text-primary-2)",
				gray: "var(--color-text-gray)",
			},
			backgroundColor: {
				primary1: "var(--color-bg-primary-1)",
				primary2: "var(--color-bg-primary-2)",
				secondary1: "var(--color-bg-secondary-1)",
			},
			borderColor: {
				primary1: "var(--color-border-1)",
			},
			keyframes: {
				reveal: {
					"0%": { opacity: "0", transform: "translateY(20px)" },
					"100%": { opacity: "100", transform: "translateY(0)" },
				},
			},
			animation: {
				reveal: "reveal 0.25s ease-out",
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
