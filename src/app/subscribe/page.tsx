'use client'
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function Page(): JSX.Element {
    // Access the user object from the authentication context
    // const { user } = useAuthContext();
    const { user } = useAuthContext() as { user: any }; // Use 'as' to assert the type as { user: any }
    const router = useRouter();
    const [plans, setPlans] = useState(null)
    const [isLoading, setLoading] = useState(true)

    console.log(user);

    useEffect( () => {
        // Redirect to the home page if the user is not logged in
        if ( user == null ) {
            router.push( "/" );
        }
        // }, [ user ] );
    }, [ user, router ] ); // Include 'router' in the dependency array to resolve eslint warning



    useEffect(() => {
        fetch('https://dev-api-permeso.savenko.tech/api/private/users/membership/all-plans',
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

    function plansList() {
        return (
            <div>
                {plans.map((plan) => {
                    return (
                        <div key={plan.id}>
                            <h2>{plan.name}</h2>
                            <p>{plan.description}</p>
                            <p>$100 per {plan.interval}</p>
                            <p>{plan.total_uses} uses per week</p>
                            <p>Up to {plan.max_councils} Councils</p>
                            <button onClick={() => {
                                console.log(plan.id);
                                fetch('https://dev-api-permeso.savenko.tech/api/private/users/membership/subscribe/'+ plan.id,
                                    {
                                        // method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            Authorization: `Bearer ${user.accessToken}`
                                        },

                                    })
                                    .then((res) => {
                                        if (res.status === 200) {
                                            fetch('https://dev-api-permeso.savenko.tech/api/private/stripe/customers-portal-link',
                                                {
                                                    headers: {
                                                        Authorization: `Bearer ${user.accessToken}`
                                                    }
                                                })
                                                .then((res) => res.json())
                                                .then((data) => {
                                                    // open the data link in a new tab
                                                    window.open(data.data, '_blank')

                                                })
                                        } else {
                                            alert('Failed to subscribe')
                                        }
                                    })

                            }} >Subscribe</button>
                        </div>
                    )
                })}
            </div>
        )
    }

    return (
        <>
            <h1>Available Plans:</h1><br/>
            {plansList()}

        </>

    );
}

export default Page;
