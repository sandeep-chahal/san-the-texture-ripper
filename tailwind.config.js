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
				primary3: "var(--color-bg-primary-3)",
				secondary1: "var(--color-bg-secondary-1)",
				red: "var(--color--bg-red)",
			},
			borderColor: {
				primary1: "var(--color-border-1)",
			},
			keyframes: {
				reveal: {
					"0%": { opacity: "0", transform: "translateY(20px)" },
					"100%": { opacity: "100", transform: "translateY(0)" },
				},
				opacity: {
					"0%": { opacity: "0" },
					"100%": { opacity: "100" },
				},
				beat: {
					"0%": {
						transform: "scale(0.95)",
					},
					"5%": {
						transform: "scale(1.1)",
					},
					"39%": {
						transform: "scale(0.85)",
					},
					"45%": {
						transform: "scale(1)",
					},
					"60%": {
						transform: "scale(0.95)",
					},
					"100%": {
						transform: "scale(0.9)",
					},
				},
			},
			animation: {
				reveal: "reveal 0.25s ease-out",
				opacity: "opacity 0.35s ease-out",
				beat: "beat 1.2s infinite cubic-bezier(0.215, 0.61, 0.355, 1)",
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
