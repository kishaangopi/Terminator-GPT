"use client";
import "../styles/globals.css";
import { signIn } from "next-auth/react";
import Image from "next/image";

function Login() {
	return (
		<div className="bg-black h-screen flex flex-col items-center justify-center text-center bg-[url('../Images/wallpaperflare.com_wallpaper.jpg')] bg-contain bg-no-repeat">
			<button
				onClick={() => signIn("google")}
				className="text-white px-4 py-2 border-2 border-white hover:text-termiRed hover:border-termiRed font-bold text-lg w-fit cursor-pointer animate-pulse tracking-widest"
			>
				L 0 G 1 N
			</button>
		</div>
	);
}

export default Login;
