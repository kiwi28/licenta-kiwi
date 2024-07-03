/** @type {import('next').NextConfig} */
const nextConfig = {
	productionBrowserSourceMaps: false, // Disable source maps in development
	optimizeFonts: false, // Disable font optimization
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
				port: "",
			},
			{
				protocol: "https",
				hostname: "firebasestorage.googleapis.com",
				port: "",
			},
		],
	},
	async headers() {
		return [
			{
				source: "/login",
				headers: [
					{
						key: "Cross-Origin-Embedder-Policy",
						value: "unsafe-none",
					},
				],
			},
		];
	},
};

export default nextConfig;
