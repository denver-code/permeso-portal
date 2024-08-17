'use client'
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { appConfig } from "@/app/config";

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

    if (isLoading) return <p className="text-center text-gray-400">Loading...</p>;

    function Navbar() {
        return (
            <div className="flex justify-between items-center bg-black text-white px-6 py-3 border-b border-gray-800">
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="text-white hover:text-gray-300"
                    >
                    <div className="text-xl font-semibold">Dashboard</div>
                    </button>
                </div>
                <div className="relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-medium text-white"
                    >
                        {user.email[0].toUpperCase()}
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute right-0 p-1 w-48 rounded-md shadow-lg bg-black border border-white ring-1 ring-black ring-opacity-5">
                            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                {[
                                    { name: "Profile", path: "/profile" },
                                    { name: "Logout", path: "/logout" },
                                ].map((item) => (
                                    <button
                                        key={item.name}
                                        onClick={() => router.push(item.path)}
                                        className="block w-full text-left px-3 py-2 rounded-md hover:bg-gray-600 hover:text-white text-sm"
                                    >
                                        {item.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    function Sidebar() {
        return (
            <div className="w-60 bg-black text-gray-300 h-full py-6 px-3 space-y-4">
                <nav className="space-y-1">
                    {[
                        { name: "Overview", path: "/dashboard" },
                        { name: "Projects", path: "/projects" },
                        { name: "Membership", path: "/membership" },
                        { name: "Activity", path: "/activity" },
                        { name: "Domains", path: "/domains" },
                        { name: "Usage", path: "/usage" },
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