import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-hot-toast";
import Google_logo from "../../public/google-logo.svg";
import { authStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
function GoogleSignIn() {
    const { googleAuth } = authStore();
    const navigate = useNavigate();
    const responseGoogle = async (authResult) => {
        try {
            if (authResult.code) {
                await googleAuth(authResult.code);
                navigate("/");
                toast.success("Welcome back!");
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to login. Try again!");
        }
    };

    const login = useGoogleLogin({
        onSuccess: responseGoogle,
        onError: responseGoogle,
        flow: "auth-code",
    });

    return (
        <button
            className="flex items-center justify-center gap-2 mt-5 p-2 w-full bg-white text-black rounded-lg font-semibold text-center"
            onClick={login}
        >
            <img src={Google_logo} alt="Google Logo" />
            Sign in with Google
        </button>
    );
}

export default GoogleSignIn;
