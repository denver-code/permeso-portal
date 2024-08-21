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
                <h2 className="text-2xl font-bold mb-4">{plan?.title}</h2>
                <p className="mb-4">{plan?.description}</p>
                <div className="mb-4">
                    <p>
                        <span className="font-bold">Price:</span> £{plan?.price} per {plan?.interval}
                    </p>
                    <p>
                        <span className="font-bold">Start Date:</span>{' '}
                        {membership?.period_start
                            ? new Date(membership.period_start * 1000).toLocaleDateString()
                            : 'N/A'}
                    </p>
                    <p>
                        <span className="font-bold">End Date:</span>{' '}
                        {membership?.period_end
                            ? new Date(membership.period_end * 1000).toLocaleDateString()
                            : 'N/A'}
                    </p>
                    <p>
                        <span className="font-bold">Status:</span> {membership?.status}
                    </p>
                </div>
                <div className="relative">
                    <button
                        className="text-zinc-700 font-bold rounded"
                        onClick={() => setShowDangerousArea(!showDangerousArea)}
                    >
                        {showDangerousArea ? 'Hide Dangerous Area' : 'Show Dangerous Area'}
                    </button>
                    {showDangerousArea && (
                        <div className="text-white rounded-lg items-center mt-4">
                            <button
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-2 rounded"
                                onClick={() => setShowCancelConfirmation(true)}
                            >
                                Cancel Membership
                            </button>
                        </div>
                    )}
                    {showCancelConfirmation && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-zinc-900 text-white p-8 rounded-lg shadow-lg w-full max-w-md">
                                <h3 className="text-lg font-bold mb-4">Dangerous Area</h3>
                                <p className="mb-4">
                                    Canceling your membership will remove your access to the platform. This action
                                    cannot be undone.
                                </p>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                                        onClick={() => {
                                            fetch(`${appConfig.apiURL}/api/private/users/membership/${membership?._id}`, {
                                                method: 'DELETE',
                                                headers: {
                                                    Authorization: `Bearer ${user.accessToken}`,
                                                },
                                            }).then((res) => {
                                                router.push('/dashboard');
                                            });
                                        }}
                                    >
                                        Confirm Cancellation
                                    </button>
                                    <button
                                        className="bg-zinc-600 hover:bg-zinc-700 text-white font-bold py-2 px-4 rounded"
                                        onClick={() => {
                                            setShowCancelConfirmation(false);
                                            setShowNotification(true);
                                            setTimeout(() => {
                                                setShowNotification(false);
                                            }, 4000);
                                        }}
                                    >
                                        Keep Membership
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {showNotification && (
                        <div
                            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg">
                            We're glad you've decided to keep your subscription!😇
                        </div>
                    )}
                </div>
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
