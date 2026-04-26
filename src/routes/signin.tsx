import { axiosInstance } from "@/lib";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function SigninPage() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			await axiosInstance.post("/v1/users/signin", formData);
			navigate("/messaging");
		} catch (error) {
			console.log("error", error);
			setError(error?.response?.data?.error);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center">
			<form
				className="bg-gray-400 p-4 rounded-lg w-100 shadow-gray-400 shadow-lg flex flex-col gap-4"
				onSubmit={handleSubmit}
			>
				<h1 className="font-semibold text-lg">Signin into your account</h1>
				<label htmlFor="email-input">Email</label>
				<input
					id="email-input"
					className="bg-gray-100 rounded-full w-full p-1"
					type="email"
					value={formData.email}
					onChange={(e) => setFormData({ ...formData, email: e.target.value })}
				/>
				<label htmlFor="password-input">Password</label>
				<input
					id="password-input"
					className="bg-gray-100 rounded-full w-full p-1"
					type="password"
					value={formData.password}
					onChange={(e) =>
						setFormData({ ...formData, password: e.target.value })
					}
				/>
				<button className="bg-blue-500 hover:bg-blue-400 py-2 px-4 rounded-full w-20 self-end">
					Signin
				</button>
				{error && <p className="text-red-700">{error}</p>}
			</form>
		</div>
	);
}
