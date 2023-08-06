"use client";

import { CpuChipIcon } from "@heroicons/react/24/outline";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { FormEvent, useState } from "react";
import { db } from "../firebase";
import toast from "react-hot-toast";
import ModelSelection from "./ModelSelection";
import useSWR from "swr";

type Props = {
	chatId: string;
};

const ChatInput = ({ chatId }: Props) => {
	const [prompt, setPrompt] = useState("");
	const { data: session } = useSession();

	// use swr to get model
	const { data: model } = useSWR("model", {
		fallbackData: "text-davinci-003",
	});

	const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!prompt) return;
		const input = prompt.trim();
		setPrompt("");

		const message: Message = {
			text: input,
			createdAt: serverTimestamp(),
			user: {
				_id: session?.user?.email!,
				name: session?.user?.name!,
				avatar:
					session?.user?.image! ||
					`https://ui-avatars.com/api/?name=${session?.user?.name}`,
			},
		};

		await addDoc(
			collection(
				db,
				"users",
				session?.user?.email!,
				"chats",
				chatId,
				"messages"
			),
			message
		);
		//toast loading
		const notification = toast.loading("Terminator is processing ...");
		await fetch("/api/askQuestion", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				prompt: input,
				chatId,
				model,
				session,
			}),
		}).then(() => {
			//toast successfull
			toast.success("Terminator has responded", {
				id: notification,
			});
		});
	};
	return (
		<div>
			<form
				onSubmit={sendMessage}
				className=" flex px-4 py-3 rounded-md   bg-gray-900 text-termiRed"
			>
				<input
					disabled={!session}
					className=" outline-none bg-transparent flex-1 disabled:cursor-not-allowed"
					type="text"
					placeholder="Type your message here ..."
					value={prompt}
					onChange={(e) => {
						setPrompt(e.target.value);
					}}
				/>
				<button
					type="submit"
					disabled={!prompt || !session}
					className="text-termiRed disabled:text-white disabled:cursor-not-allowed"
				>
					<CpuChipIcon className="h-5 w-5  " />
				</button>
			</form>
			<div className="md:hidden">
				<ModelSelection />
			</div>
		</div>
	);
};

export default ChatInput;
