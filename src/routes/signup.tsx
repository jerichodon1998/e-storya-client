import { axiosInstance } from "@lib";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function SignupPage() {
	const navigate = useNavigate();
	const [signupFormData, setSignupFormData] = useState({
		email: "",
		password: "",
		username: "",
	});
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			await axiosInstance.post("/v1/users/signup", signupFormData);
			navigate("/messaging");
		} catch (error) {
			console.log("error", error);
			setError(
				error?.response?.data?.error?.message?.toString() ||
					"something went wrong"
			);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center">
			<form
				className="bg-gray-400 p-4 rounded-lg w-100 shadow-gray-400 shadow-lg flex flex-col gap-4"
				onSubmit={handleSubmit}
			>
				<h1 className="font-semibold text-lg">Signup to start conversations</h1>
				<label htmlFor="email-input">Email</label>
				<input
					id="email-input"
					className="bg-gray-100 rounded-full w-full p-1"
					type="email"
					required
					value={signupFormData.email}
					onChange={(e) =>
						setSignupFormData({ ...signupFormData, email: e.target.value })
					}
				/>
				<label htmlFor="password-input">Username</label>
				<input
					id="password-input"
					className="bg-gray-100 rounded-full w-full p-1"
					required
					value={signupFormData.username}
					onChange={(e) =>
						setSignupFormData({ ...signupFormData, username: e.target.value })
					}
				/>
				<label htmlFor="password-input">Password</label>
				<input
					id="password-input"
					className="bg-gray-100 rounded-full w-full p-1"
					type="password"
					required
					value={signupFormData.password}
					onChange={(e) =>
						setSignupFormData({ ...signupFormData, password: e.target.value })
					}
				/>
				<button className="bg-blue-500 hover:bg-blue-400 py-2 px-4 rounded-full w-20 self-end">
					Signup
				</button>
				{error && <p className="text-red-700">{error}</p>}
			</form>
		</div>
	);
}
