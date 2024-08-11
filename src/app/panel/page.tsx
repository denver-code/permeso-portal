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
    const [isLoading, setLoading] = useState(true)

    useEffect( () => {
        // Redirect to the home page if the user is not logged in
        if ( user == null ) {
            router.push( "/" );
        }
        // }, [ user ] );
    }, [ user, router ] ); // Include 'router' in the dependency array to resolve eslint warning

    useEffect(() => {

        fetch('https://api-permeso.savenko.tech/api/private/users/membership/my',
            {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`
                }
            })
            .then((res) => res.json())
            .then((data) => {
                setMembership(data)
                setLoading(false)
            })
    }, [user]);
    // @ts-ignore

    if (isLoading) return <p>Loading...</p>

    function navigation(){
        return (
            <div>
                <button onClick={() => router.push("/profile")}>Profile</button>
                <br/>
                <button onClick={() => router.push("/logout")}>Logout</button>
            </div>
        )
    }

    function subscription(){
        if (!membership && !isLoading) return (
            <div>
                <button onClick={() => router.push("/subscribe")}>Subscribe</button>
            </div>
        )

        return (
            <div>
                <h2>You have active membership!</h2>

            </div>
        )
    }
    return (
        <>
            <h2>Welcome, {user.email}</h2><br/>
            {subscription()}<br/>
            {navigation()}
        </>

    );
}

export default Page;
