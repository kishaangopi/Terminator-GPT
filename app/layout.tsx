import Sidebar from "../components/Sidebar";
import { SessionProvider } from "../components/SessionProvider";
import { getServerSession } from "next-auth";
import Login from "../components/Login";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import ClientProvider from "../components/ClientProvider";

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getServerSession(authOptions);
	console.log(session);
	return (
		<html>
			<head>
				<title>Terminator-GPT</title>
			</head>

			<body>
				<SessionProvider session={session}>
					{!session ? (
						<Login />
					) : (
						<div className="flex">
							<div className="bg-black max-w-xs h-screen overflow-y-auto md:min-w-[18rem]">
								<Sidebar />
							</div>

							<ClientProvider />
							<div className="bg-black flex-1">{children}</div>
						</div>
					)}
				</SessionProvider>
			</body>
		</html>
	);
}
