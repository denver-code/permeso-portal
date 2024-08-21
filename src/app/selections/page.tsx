'use client'
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {appConfig} from "@/app/config";
import {LoaderIndicator} from "@/app/components/LoaderIndicator";
import {Plan} from "@/app/subscribe/page";
import Navbar from "@/app/components/navbar";


interface MembershipResponse {
    _id: string;
    user_id: string;
    firebase_user_id: string;
    stripe_user_id: string;
    stripe_subscription_id: string;
    plan_id: string;
    status: string;
    period_start: number;
    period_end: number;
    created_at: number;
    updated_at: number;
    meta: any;
}


function Page(): JSX.Element {
    // Access the user object from the authentication context
    // const { user } = useAuthContext();
    const { user } = useAuthContext() as { user: any }; // Use 'as' to assert the type as { user: any }
    const router = useRouter();
    const [membership, setMembership] = useState<MembershipResponse | null>(null);
    const [plan, setPlan] = useState<Plan | null>(null)
    const [isLoading, setLoading] = useState(true)
    const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
    const [showDangerousArea, setShowDangerousArea] = useState(false);
    const [showNotification, setShowNotification] = useState(false);

    useEffect( () => {
        // Redirect to the home page if the user is not logged in
        if ( user == null ) {
            router.push( "/" );
        }
        // }, [ user ] );
    }, [ user, router ] ); // Include 'router' in the dependency array to resolve eslint warning

    useEffect(() => {

        fetch(appConfig.apiURL + '/api/private/users/membership/my',
            {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`
                }
            })
            .then((res) => res.json())
            .then((data) => {
                if (data == null) {
                    return router.push("/subscribe")
                }

                setMembership(data)

                fetch(appConfig.apiURL + `/api/private/users/plans/${data.plan_id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${user.accessToken}`
                        }
                    })
                    .then((res) => res.json())
                    .then((data) => {
                        setPlan(data)
                        setLoading(false)
                    })
            })
    }, [user]);
    // @ts-ignore

    if (isLoading) return <LoaderIndicator/>

    function membershipComponent(){
        // @ts-ignore
        return (
            <div className="bg-zinc-900 text-white p-8 rounded-lg shadow-lg mx-auto">
              
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen bg-black">
            <Navbar/>
            <div className="flex-1 p-6 mx-auto items-center ">
                {membershipComponent()}
            </div>
        </div>

    );
}

export default Page;
