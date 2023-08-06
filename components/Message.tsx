import { DocumentData } from "firebase/firestore";
import React from "react";

type Props = {
	message: DocumentData;
};

function Message({ message }: Props) {
	const isTerminator = message.user.name === "TerminatorGPT";
	return (
		<div
			className={`py-5 ${isTerminator && "text-termiRed"} ${
				!isTerminator && "bg-slate-900 text-white"
			}`}
		>
			<div className="flex items-center justify-start space-x-5 px-10 max-w-2xl ">
				<img
					src={message?.user?.avatar!}
					alt=""
					className={`${isTerminator && "h-16 w-16"} ${
						!isTerminator && "h-10 w-10"
					} rounded-full object-cover `}
				/>
				<p
					className={`${isTerminator && "justify-self-end"} ${
						!isTerminator && "justify-end"
					}`}
				>
					{message.text}
				</p>
			</div>
		</div>
	);
}

export default Message;
