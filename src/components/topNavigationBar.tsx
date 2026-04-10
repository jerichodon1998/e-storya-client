import { Link } from "react-router";

export default function TopNavigationBar() {
	return (
		<nav className="p-4 bg-gray-200 rounded-full w-full">
			<ul className="flex justify-between items-center">
				<ul>
					<li>
						<Link to={"/"}>
							<h1 className="font-bold text-xl">E-storya</h1>
						</Link>
					</li>
				</ul>
				<ul className="flex justify-between items-center gap-4">
					<li>
						<Link to="/signin">
							<button className="bg-blue-500 hover:bg-blue-400 py-2 px-4 rounded-full w-20">
								Signin
							</button>
						</Link>
					</li>
					<li>
						<Link to="/signup">
							<button className="bg-gray-300 hover:bg-gray-400 py-2 px-4 rounded-full w-20">
								Signup
							</button>
						</Link>
					</li>
				</ul>
			</ul>
		</nav>
	);
}
