// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";
import query from "../../lib/queryApi";
import { adminDb } from "../../firebaseAdmin";
import admin from "firebase-admin";

type Data = {
	answer: string;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const { prompt, chatId, model, session } = req.body;
	if (!prompt) {
		res.status(400).json({ answer: "Provide a prompt" });
		return;
	}

	if (!chatId) {
		res.status(400).json({ answer: "Provide a valid chat ID" });
		return;
	}

	const response = await query(prompt, model);
	const message: Message = {
		text: response || "Terminator was unable get the answer",
		createdAt: admin.firestore.Timestamp.now(),
		user: {
			_id: "TerminatorGPT",
			name: "TerminatorGPT",
			avatar:
				"https://c4.wallpaperflare.com/wallpaper/380/780/913/terminator-cyborg-movies-t-800-wallpaper-thumb.jpg",
		},
	};

	await adminDb
		.collection("users")
		.doc(session?.user?.email!)
		.collection("chats")
		.doc(chatId)
		.collection("messages")
		.add(message);

	res.status(200).json({ answer: message.text });
}
