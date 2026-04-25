import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
	server: {
		port: 3000,
	},
	resolve: {
		tsconfigPaths: true,
		alias: {
			"@": `${process.cwd()}/src`,
			"@lib": `${process.cwd()}/src/lib`,
			"@hooks": `${process.cwd()}/src/hooks`,
			"@components": `${process.cwd()}/src/components`,
		},
	},
});
