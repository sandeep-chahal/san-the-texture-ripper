import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		VitePWA({
			manifest: {
				// content of manifest
				name: "San: The Texture Ripper",
				short_name: "TRipper",
				start_url: "/",
				display: "standalone",
				background_color: "#fff",
				theme_color: "#fff",
				icons: [
					{
						src: "/favicon.ico",
						sizes: "16x16 32x32",
						type: "image/x-icon",
					},
					{
						src: "/android-chrome-192x192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "/android-chrome-512x512.png",
						sizes: "512x512",
						type: "image/png",
					},
				],
			},
			registerType: "autoUpdate",
			workbox: {
				globPatterns: ["**/*.{js,css,ico,html,svg,png}"],
				cleanupOutdatedCaches: true,
			},
		}),
	],
	publicDir: "./public",
});
