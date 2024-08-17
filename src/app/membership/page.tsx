'use client'
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function Page(): JSX.Element {
    // Access the user object from the authentication context
    // const { user } = useAuthContext();
    const { user } = useAuthContext() as { user: any }; // Use 'as' to assert the type as { user: any }
    const router = useRouter();
    const [membership, setMembership] = useState(null)
    const [plan, setPlan] = useState(null)
    const [isLoading, setLoading] = useState(true)

    useEffect( () => {
        // Redirect to the home page if the user is not logged in
        if ( user == null ) {
            router.push( "/" );
        }
        // }, [ user ] );
    }, [ user, router ] ); // Include 'router' in the dependency array to resolve eslint warning

    console.log(user.accessToken)

    useEffect(() => {

        fetch('https://dev-api-permeso.savenko.tech/api/private/users/membership/my',
            {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`
                }
            })
            .then((res) => res.json())
            .then((data) => {
                setMembership(data)

                fetch(`https://dev-api-permeso.savenko.tech/api/private/users/plans/${data.plan_id}`,
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

    if (isLoading) return <p>Loading...</p>

    function membershipComponent(){
        return (
            <div>
                <h2>{plan.title}</h2>
                <p>{plan.description}</p>
                <p>Price: {plan.price} {plan.currency} per {plan.interval}</p>
                <p>Start Date: {membership.period_start}</p>
                <p>End Date: {membership.period_end}</p>
            </div>
        )
    }
    return (
        <>
            <h1>Your Current Membership:</h1>
            {membershipComponent()}

            <button
                onClick={ () => {
                    fetch(`https://dev-api-permeso.savenko.tech/api/private/users/membership/${membership.id}`,
                        {
                            method: 'DELETE',
                            headers: {
                                Authorization: `Bearer ${user.accessToken}`
                            }
                        })
                        .then((res) => {
                            router.push("/panel")
                        })
                        
                } }
            >
                Cancel Membership
            </button>

            <button
                onClick={ () => router.push( "/panel" ) }
            >
                Back to Panel
            </button>
        </>

    );
}

export default Page;
