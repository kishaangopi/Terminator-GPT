"use client";
import { collection, orderBy, query } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../firebase";
import Message from "./Message";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";

type Props = {
	chatId: string;
};

function Chat({ chatId }: Props) {
	const { data: session } = useSession();

	const [messages] = useCollection(
		session &&
			query(
				collection(
					db,
					"users",
					session?.user?.email!,
					"chats",
					chatId,
					"messages"
				),
				orderBy("createdAt", "asc")
			)
	);

	return (
		<div className="flex-1 overflow-y-auto overflow-x-hidden">
			{messages?.empty && (
				<>
					<p className="mt-10 text-center text-termiRed">
						Start a conversation with the Terminator
					</p>
					<ExclamationCircleIcon className="h-10 w-10 mx-auto mt-5 text-termiRed animate-bounce" />
				</>
			)}
			{messages?.docs.map((message) => (
				<Message key={message.id} message={message.data()} />
			))}
		</div>
	);
}

export default Chat;
