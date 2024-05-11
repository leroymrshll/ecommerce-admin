import Layout from "@/components/Layout";

export default function Home() {
    return <Layout>
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