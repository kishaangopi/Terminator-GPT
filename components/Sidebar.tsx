"use client";
import { useSession } from "next-auth/react";
import NewChat from "./NewChat";
import { signOut } from "next-auth/react";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import ChatRow from "./ChatRow";
import ModelSelection from "./ModelSelection";

const Sidebar = () => {
	const { data: session } = useSession();

	const [chats, loading, error] = useCollection(
		session &&
			query(
				collection(db, "users", session.user?.email!, "chats"),
				orderBy("createdAt", "asc")
			)
	);

	return (
		<div className="h-screen flex flex-col p-2 border-2 border-termiRed rounded-lg">
			<div className="flex-1">
				<div>
					<NewChat />
					<div className="hidden sm:inline">
						<ModelSelection />
					</div>

					<div className="space-y-2 mt-5">
						{loading && (
							<div className="animate-pulse text-center text-termiRed">
								<p>Loading Chats...</p>
							</div>
						)}

						{chats?.docs.map((chat) => (
							<ChatRow key={chat.id} id={chat.id} />
						))}
					</div>
				</div>
			</div>
			{session && (
				<div className="flex flex-col justify-center items-center space-y-4 ">
					<img
						className="h-16 w-16 rounded-full cursor-pointer   hover:opacity-50"
						src={session.user?.image!}
						alt=""
					/>
					<button className="chatRow w-full" onClick={() => signOut()}>
						L0G0U7
					</button>
				</div>
			)}
		</div>
	);
};

export default Sidebar;
