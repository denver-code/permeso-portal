'use client'
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { appConfig } from "@/app/config";
import Navbar from "../components/navbar";

function Page(): JSX.Element {
    const { user } = useAuthContext() as { user: any };
    const router = useRouter();
    const [membership, setMembership] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        if (user == null) {
            router.push("/");
        }
    }, [user, router]);

    useEffect(() => {
        fetch(appConfig.apiURL + '/api/private/users/membership/my', {
            headers: {
                Authorization: `Bearer ${user.accessToken}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                setMembership(data);
                setLoading(false);
            });
    }, [user]);

    if (isLoading) return <>
        <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white" />
        </div>
    </>;

    function Sidebar() {
        return (
            <div className="w-60 bg-black text-gray-300 h-full py-6 px-3 space-y-4">
                <nav className="space-y-1">
                    {[
                        { name: "Overview", path: "/dashboard" },
                        { name: "Membership", path: "/membership" },
                        { name: "Settings", path: "/settings" },
                    ].map((item) => (
                        <button
                            key={item.name}
                            onClick={() => router.push(item.path)}
                            className="block w-full text-left px-3 py-2 rounded-md hover:bg-gray-600 hover:text-white text-sm"
                        >
                            {item.name}
                        </button>
                    ))}
                </nav>
            </div>
        );
    }

    function Content() {
        return (
            <div className="flex-1 bg-black text-white p-6">
                <h2 className="text-2xl font-bold mb-6">Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-black-900 p-4 rounded-lg border border-gray-500">
                        <h3 className="text-sm font-medium text-gray-400 mb-2">Applications</h3>
                        <p className="text-2xl font-semibold">0</p>
                    </div>
                    <div className="bg-black-900 p-4 rounded-lg border border-gray-500">
                        <h3 className="text-sm font-medium text-gray-400 mb-2">Average per Council</h3>
                        <p className="text-2xl font-semibold">0</p>
                    </div>
                    <div className="bg-black-900 p-4 rounded-lg border border-gray-500">
                        <h3 className="text-sm font-medium text-gray-400 mb-2">Usage</h3>
                        <p className="text-sm text-gray-500">No data available</p>
                    </div>
                </div>
                <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                    <p className="text-sm text-gray-500">No recent activity, but normally you would see a parsed councils data</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-black">
            <Navbar />
            <div className="flex flex-1">
                <Sidebar />
                <Content />
            </div>
        </div>
    );
}

export default Page;