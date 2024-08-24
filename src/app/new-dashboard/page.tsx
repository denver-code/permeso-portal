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
        if (!user) {
            router.push("/");
            return;
        }

        const fetchData = async () => {
            try {
                const headers = {
                    Authorization: `Bearer ${user.accessToken}`
                };

                const membershipResponse = await fetch(`${appConfig.apiURL}/api/private/users/membership/my`, { headers });
                const membershipData = await membershipResponse.json();
                setMembership(membershipData);

                const activitiesResponse = await fetch(`${appConfig.apiURL}/api/private/users/dashboard/recent-activity`, { headers });
                const activitiesData = await activitiesResponse.json();
                setActivities(activitiesData.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white" />
            </div>
        );
    }

    console.log(user.accessToken);

    if (membership == null) {
        router.push("/subscribe");
    }

    return (
        <div className="flex flex-col min-h-screen bg-black">
            {/* Your dashboard content goes here */}
        </div>
    );
}

export default Page;