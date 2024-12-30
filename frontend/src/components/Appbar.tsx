import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";

export const Appbar = () => {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    //@ts-ignore
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleLogout = () => {
        localStorage.removeItem("token"); // Remove JWT token from localStorage
        navigate("/signin"); // Redirect to the sign-in page
    };

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setShowDropdown(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setShowDropdown(false);
        }, 1000); 
    };

    return (
        <div className="border-b flex justify-between px-10 py-4">
            <Link to={'/blogs'} className="flex items-center cursor-pointer">
                {/* Clickable Circular "W" Icon */}
                <Link to="/">
                    <div className="flex items-center justify-center bg-gray-800 text-white rounded-full w-10 h-10 mr-2 cursor-pointer">
                        W
                    </div>
                </Link>
                Writesphere-Medium
            </Link>
            <div className="flex items-center relative">
                <Link to={`/publish`}>
                    <button
                        type="button"
                        className="mr-4 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2"
                    >
                        New
                    </button>
                </Link>
                <div
                    className="relative"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {/* Exit door symbol */}
                    <div className="flex items-center justify-center bg-gray-200 text-white rounded-full w-10 h-10 hover:bg-gray-100 text-3xl cursor-pointer">
                        🚪
                    </div>
                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10">
                            <div className="px-4 py-2 text-blue-700 font-bold font-serif">See you soon 😊 </div>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
