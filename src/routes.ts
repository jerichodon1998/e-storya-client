import {
	type RouteConfig,
	index,
	layout,
	route,
} from "@react-router/dev/routes";

export default [
	layout("./layouts/main/main.tsx", [
		index("./routes/home.tsx"),
		route("signin", "./routes/signin.tsx"),
		route("signup", "./routes/signup.tsx"),
	]),
	layout("./layouts/protected-layout/protectedLayout.tsx", [
		route("messaging", "./routes/messaging/index.tsx", [
			route(":channelId", "./routes/messaging/chatBoxPage.tsx"),
		]),
	]),
] satisfies RouteConfig;
