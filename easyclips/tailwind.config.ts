import type { Config } from "tailwindcss";
import { frostedThemePlugin } from "@whop/react/tailwind";

export default {
	content: [
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				cream: "#FCF6F5",
				dark: "#141212",
				accent: "#FA4616",
			},
		},
	},
	plugins: [frostedThemePlugin()],
} satisfies Config;
