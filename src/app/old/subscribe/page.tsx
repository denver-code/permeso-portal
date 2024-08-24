'use client'
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {appConfig} from "@/app/config";
import {Navbar} from "@/components/common/navbar";


export interface Plan {
    id: string;
    title: string;
    description: string;
    interval: string;
    total_uses: number;
    max_councils: number;
    price: number;
    currency: string;
    status: string;
}

interface PlansResponse {
    data: Plan[];
    total: number;
    status: string;
}

function Page(): JSX.Element {
    // Access the user object from the authentication context
    // const { user } = useAuthContext();
    const { user } = useAuthContext() as { user: any }; // Use 'as' to assert the type as { user: any }
    const router = useRouter();
    const [plans, setPlans] = useState<Plan[]>([])
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
          if (user == null) {
            return router.push("/");
        }
        fetch(appConfig.apiURL + '/api/private/users/membership/my',
            {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`
                }
            })
            .then((res) => res.json())
            .then((data) => {
               if (data != null) {
                     return router.push("/membership")
               }
            })
        fetch(appConfig.apiURL + '/api/private/users/plans/',
            {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`
                }
            })
            .then((res) => res.json())
            .then((data) => {
                setPlans(data.data)
                setLoading(false)
            })
    }, [user]);
    // @ts-ignore

    if (isLoading) return <p>Loading...</p>

    function PlansList() {
        return (
            <div className="flex flex-col items-center justify-center ">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className="bg-zinc-900 text-white rounded-lg p-6 space-y-4 flex flex-col items-center justify-center"
                        >
                            <h2 className="text-2xl font-bold text-center">{plan.title}</h2>
                            <p className="text-center">{plan.description}</p>
                            <div className="space-y-2 text-center">
                                <p>
                                    <span className="font-bold">£{plan.price}</span> per <span
                                    className="font-bold">{plan.interval}</span>
                                </p>
                                <p>
                                    <span className="font-bold">{plan.total_uses}</span> collections per week
                                </p>
                                <p>
                                    Up to <span className="font-bold">{plan.max_councils}</span> Councils
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    fetch(
                                        `${appConfig.apiURL}/api/private/users/membership/subscribe/${plan.id}`,
                                        {
                                            headers: {
                                                'Content-Type': 'application/json',
                                                Authorization: `Bearer ${user.accessToken}`,
                                            },
                                        }
                                    )
                                        .then((res) => {
                                            if (res.status === 200) {
                                                fetch(`${appConfig.apiURL}/api/private/stripe/customers-portal-link`, {
                                                    headers: {
                                                        Authorization: `Bearer ${user.accessToken}`,
                                                    },
                                                })
                                                    .then((res) => res.json())
                                                    .then((data) => {
                                                        window.open(data.data, '_blank');
                                                    });
                                            } else {
                                                alert('Failed to subscribe');
                                            }
                                        })
                                        .catch((err) => console.error('Error:', err));
                                }}
                                className="bg-white text-gray-900 font-bold px-4 py-2 rounded-md hover:bg-gray-200"
                            >
                                Subscribe
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen bg-black">
            <Navbar/>
            <div className="flex-1 p-6 mx-auto items-center ">
                <h1 className="text-3xl font-bold text-white pb-6">Choose a Plan</h1>
                <PlansList/>
            </div>
        </div>

    );
}

export default Page;
