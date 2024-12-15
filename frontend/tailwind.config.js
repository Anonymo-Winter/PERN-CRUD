/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                cyan: {
                    50: "#e1f0f3",
                    100: "#b3d9df",
                    200: "#80b6c4",
                    300: "#4d99a9",
                    400: "#2a7f8e",
                    500: "#2e5265", // Custom cyan
                    600: "#1d4250",
                    700: "#17343d",
                    800: "#122637",
                    900: "#1e3a3d", // Custom cyan dark
                },
                blue: {
                    50: "#e5f3e7",
                    100: "#bbd9d2",
                    200: "#8abfb8",
                    300: "#5aa59e",
                    400: "#319b85",
                    500: "#92c4aa", // Custom blue
                    600: "#75a78a",
                    700: "#5f8d74",
                    800: "#4b7360",
                    900: "#3c5d4d", // Custom blue dark
                },
            },
        },
    },
    plugins: [daisyui],
};
