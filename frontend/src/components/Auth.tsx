import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SignupInput } from "@raghvendra_04/medium-common";
import axios from "axios";
import { BACKEND_URL } from "../config";

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
    const navigate = useNavigate();
    const [postInputs, setPostInputs] = useState<SignupInput>({
        name: "",
        username: "",
        password: "",
    });
    const [error, setError] = useState<string | null>(null);

    async function sendRequest() {
        try {
            const response = await axios.post(
                `${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`,
                postInputs
            );
            const jwt = response.data;
            localStorage.setItem("token", jwt);
            navigate("/blogs");
        } catch (e: any) {
            const errorMessage = e.response?.data?.message || "An error occurred. Please try again.";
            setError(errorMessage);
            setTimeout(() => setError(null), 3000); // Clear the error after 3 seconds
        }
    }

    return (
        <div className="h-screen flex justify-center items-center">
            <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
                <div className="mb-4 text-center">
                    <h2 className="text-3xl font-extrabold">
                        {type === "signup" ? "Create an Account" : "Sign In"}
                    </h2>
                    <p className="text-slate-500 mt-2">
                        {type === "signin"
                            ? "Don't have an account?"
                            : "Already have an account?"}
                        <Link
                            className="pl-2 underline text-blue-600 hover:text-blue-800"
                            to={type === "signin" ? "/signup" : "/signin"}
                        >
                            {type === "signin" ? "Sign up" : "Sign in"}
                        </Link>
                    </p>
                </div>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        sendRequest();
                    }}
                >
                    {type === "signup" && (
                        <LabelledInput
                            label="Name"
                            placeholder="Raghvendra Dhakad..."
                            onChange={(e) =>
                                setPostInputs({
                                    ...postInputs,
                                    name: e.target.value,
                                })
                            }
                        />
                    )}
                    <LabelledInput
                        label="Username"
                        placeholder="example@gmail.com"
                        onChange={(e) =>
                            setPostInputs({
                                ...postInputs,
                                username: e.target.value,
                            })
                        }
                    />
                    <LabelledInput
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                        onChange={(e) =>
                            setPostInputs({
                                ...postInputs,
                                password: e.target.value,
                            })
                        }
                    />
                    <button
                        type="submit"
                        className="mt-6 w-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
                    >
                        {type === "signup" ? "Sign up" : "Sign in"}
                    </button>
                </form>
                {error && (
                    <div className="mt-4 text-sm text-red-500 bg-red-100 p-2 rounded">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

interface LabelledInputType {
    label: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}

function LabelledInput({ label, placeholder, onChange, type }: LabelledInputType) {
    return (
        <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
            <input
                type={type || "text"}
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder={placeholder}
                onChange={onChange}
                required
            />
        </div>
    );
}
