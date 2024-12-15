import Input from "../components/Input.jsx";
import { Mail, Lock, User, Loader } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authStore } from "../store/authStore.jsx";
import { toast } from "react-hot-toast";
import GoogleSignIn from "../components/GoogleSignIn.jsx";

const SignupPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { error, signup, isLoading } = authStore();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await signup(email, password, name);
            toast.success("Account created successfully");
            return navigate("/");
        } catch (error) {
            toast.error("Failed to create account. Try again!");
            console.log(error.message);
        }
    };
    return (
        <div className="items-center max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter background-blur-xl rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
                <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
                    Create Account
                </h2>
                <form onSubmit={handleSignup}>
                    <Input
                        icon={User}
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                        icon={Mail}
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        icon={Lock}
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && <p className="text-red-500 font-semibold mb-4">{error}</p>}

                    <button
                        className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
                        type="submit"
                    >
                        {isLoading ? <Loader className="size-4 mx-auto animate-spin" /> : "Signup"}
                    </button>
                </form>
                <GoogleSignIn />
            </div>
            <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
                <p className="text-sm text-white">
                    Already have an account?{" "}
                    <Link to="/login" className="text-green-500 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;