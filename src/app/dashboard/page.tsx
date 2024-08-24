'use client'
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { appConfig } from "@/app/config";
import Navbar from "../components/navbar";



function Page(): JSX.Element {
    const { user } = useAuthContext() as { user: any };
    const router = useRouter();
    const [membership, setMembership] = useState<MembershipResponse | null>(null);
    const [activities, setActivities] = useState<RecentActivityResponse | null>(null);
    const [isLoading, setLoading] = useState(true);
    
    useEffect(() => {
         if (user == null) {
            return router.push("/");
        }
        fetch(appConfig.apiURL + '/api/private/users/membership/my', {
            headers: {
                Authorization: `Bearer ${user.accessToken}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                setMembership(data);

                fetch(appConfig.apiURL + '/api/private/users/dashboard/recent-activity', {
                    headers: {
                        Authorization: `Bearer ${user.accessToken}`
                    }
                })
                    .then((res) => res.json())
                    .then((data) => {
                        setActivities(data.data);

                    })
                    .catch((err) => {
                        console.error(err);
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            });
    }, [user, router, setMembership, setActivities, setLoading]);

    if (isLoading) return <>
        <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white" />
        </div>
    </>;

    function Sidebar() {
        return (
            <div className="sm:w-24 md:w-60 bg-black text-gray-300 h-full py-6 px-3 space-y-4">
                <nav className="space-y-1">
                    {[
                        { name: "Overview", path: "/dashboard" },
                        { name: "Membership", path: "/membership" },
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

    function RecentActivity(){
        if (activities == null) return <p className="text-sm text-gray-500">No recent activity, but normally you would see a parsed councils data</p>;

        return activities.activity.map((activity) => (
            <div key={activity.council} className="flex items-center justify-between bg-black-900 p-4 rounded-lg border border-gray-500">
                <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">{activity.council.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
                    <p className="text-sm text-gray-500">{activity.date}</p>
                </div>
                <a onClick={()=>{
                    fetch(activity.download_link, {
                        headers: {
                            Authorization: `Bearer ${user.accessToken}`
                        }
                    })
                        .then((res) => res.blob())
                        .then((blob) => {
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `${activity.council}.xlsx`;
                            a.click();
                        })
                        .catch((err) => {
                            console.error(err);
                        });
                }} target="_blank" className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg">Download</a>
            </div>
        ));
    }

    function Content() {
        return (
            <div className="flex-1 bg-black text-white p-6">
                <h2 className="text-2xl font-bold mb-6">Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-black-900 p-4 rounded-lg border border-gray-500">
                        <h3 className="text-sm font-medium text-gray-400 mb-2">Applications</h3>
                        <p className="text-2xl font-semibold">{activities?.total_applications ? activities?.total_applications : "N/A"}</p>
                    </div>
                    <div className="bg-black-900 p-4 rounded-lg border border-gray-500">
                        <h3 className="text-sm font-medium text-gray-400 mb-2">Average per Council</h3>
                        <p className="text-2xl font-semibold">
                                {activities?.avarage_per_council
                                    ?  Math.round(activities?.avarage_per_council)
                                    : 'N/A'}
                       </p>
                    </div>
                    <div className="bg-black-900 p-4 rounded-lg border border-gray-500">
                        <h3 className="text-sm font-medium text-gray-400 mb-2">Usage</h3>
                        <p className="text-sm text-gray-500">No data available</p>
                    </div>
                </div>
                <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        <RecentActivity/>
                    </div>
                    
                </div>
            </div>
        );
    }

    function GetMembershipBanner(){
        // user don't have a membership, show banner that will redirect to membership page
        return (
            <div className="bg-orange-500 text-gray-900 py-5 px-10 h-min rounded-2xl mx-auto mt-8">
                <div className="flex items-center justify-between">
                    <p className="text-lg">
                        You don&apos;t have a subscription yet, <a href="/subscribe"
                                                                   className="font-bold hover:underline">follow this
                        link to view our pricing!</a>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-black">
            <Navbar/>
            <div className="flex flex-1">
                <Sidebar/>
                {membership == null ? <GetMembershipBanner/> : <Content/>}
            </div>
        </div>
    );
}

export default Page;