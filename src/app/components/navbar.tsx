'use client'
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { appConfig } from "@/app/config";

function Navbar(): JSX.Element {
    const { user } = useAuthContext() as { user: any };
    const router = useRouter();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        if (user == null) {
            router.push("/");
        }
    }, [user, router]);

    function Navbar() {
        return (
            <div className="flex justify-between items-center bg-black text-white px-6 py-3 border-b border-gray-800">
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="text-white hover:text-gray-300"
                    >
                    <div className="text-xl font-semibold">Permeso</div>
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
                                {/* user Email */}
                                <div className="block px-4 py-2 text-sm text-zinc-400 font-bold">
                                    {user.email}
                                </div>
                                {/* divider */}
                                <div className="border-t border-zinc-700 my-2"></div>
                                {/* Profile and Logout */}
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

    return (
      <Navbar />
    );
}

export default Navbar;