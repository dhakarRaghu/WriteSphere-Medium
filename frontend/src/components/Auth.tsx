import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";
import * as z from "zod";

// Validation schemas using zod
const signupSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

const signinSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
    const navigate = useNavigate();
    const [postInputs, setPostInputs] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    async function sendRequest() {
        // Select schema based on auth type
        const schema = type === "signup" ? signupSchema : signinSchema;

        // Validate inputs
        const validation = schema.safeParse(postInputs);
        if (!validation.success) {
            const fieldErrors: { [key: string]: string } = {};
            validation.error.errors.forEach((err) => {
                if (err.path.length > 0) {
                    fieldErrors[err.path[0] as string] = err.message;
                }
            });
            setErrors(fieldErrors);
            return;
        }

        try {
            const response = await axios.post(
                `${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`,
                postInputs
            );
            const jwt = response.data;
            localStorage.setItem("token", jwt);
            navigate("/blogs");
        } catch (e) {
            alert("Error while signing up");
        }
    }

    return (
        <div className="h-screen flex justify-center flex-col">
            <div className="flex justify-center">
                <div>
                    <div className="px-10">
                        <div className="text-4xl font-extrabold">
                            {type === "signup" ? "Create an account" : "Sign in to your account"}
                        </div>
                        <div className="text-slate-500">
                            {type === "signin"
                                ? "Don't have an account?"
                                : "Already have an account?"}
                            <Link
                                className="pl-2 underline"
                                to={type === "signin" ? "/signup" : "/signin"}
                            >
                                {type === "signin" ? "Sign up" : "Sign in"}
                            </Link>
                        </div>
                    </div>
                    <div className="pt-8">
                        {type === "signup" && (
                            <LabelledInput
                                label="Name"
                                placeholder="Raghvendra Dhakad..."
                                onChange={(e) =>
                                    setPostInputs({ ...postInputs, name: e.target.value })
                                }
                                error={errors.name}
                            />
                        )}
                        <LabelledInput
                            label="email"
                            placeholder="rdhakad2002@gmail.com"
                            onChange={(e) =>
                                setPostInputs({ ...postInputs, email: e.target.value })
                            }
                            error={errors.email}
                        />
                        <LabelledInput
                            label="Password"
                            type="password"
                            placeholder="password.."
                            onChange={(e) =>
                                setPostInputs({ ...postInputs, password: e.target.value })
                            }
                            error={errors.password}
                        />
                        <button
                            onClick={sendRequest}
                            type="button"
                            className="mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                        >
                            {type === "signup" ? "Sign up" : "Sign in"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface LabelledInputType {
    label: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    error?: string;
}

function LabelledInput({ label, placeholder, onChange, type, error }: LabelledInputType) {
    return (
        <div>
            <label className="block mb-2 text-sm text-black font-semibold pt-4">{label}</label>
            <input
                onChange={onChange}
                type={type || "text"}
                className={`bg-gray-50 border ${
                    error ? "border-red-500" : "border-gray-300"
                } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                placeholder={placeholder}
                required
            />
            {error && <p className="text-red-500 text-xs">{error}</p>}
        </div>
    );
}
