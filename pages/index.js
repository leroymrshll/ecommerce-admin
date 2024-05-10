import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";

export default function Home() {
    const {data: session} = useSession();
    return <Layout>
        <div className="text-black flex justify-between items-center">
            <h2>
                Hello, <b>{session?.user?.name}</b>
            </h2>
            <div className="flex bg-gray-300 text-black gap-3 pr-3 items-center rounded-lg overflow-hidden">
                <img src={session?.user?.image} alt="" className="w-8 h-8" />
                <span>{session?.user?.name}</span>
            </div>
        </div>
        <div className="flex flex-col items-center justify-center">
            <h1>
                Welcome to the e-commerce admin dashboard.
            </h1>
            <h1>
                Navigate to the products tab to get started.
            </h1>
        </div>
    </Layout>
}