import {
	type RouteConfig,
	index,
	layout,
	route,
} from "@react-router/dev/routes";

export default [
	layout("./layouts/main.tsx", [
		index("./routes/home.tsx"),
		route("signin", "./routes/signin.tsx"),
		route("signup", "./routes/signup.tsx"),
	]),
	route("messaging", "./routes/messaging.tsx"),
] satisfies RouteConfig;
