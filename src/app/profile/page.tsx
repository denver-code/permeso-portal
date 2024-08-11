'use client'
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

function Page(): JSX.Element {
    // Access the user object from the authentication context
    // const { user } = useAuthContext();
    const { user } = useAuthContext() as { user: any }; // Use 'as' to assert the type as { user: any }
    const router = useRouter();
    const [data, setData] = useState(null)
    const [isLoading, setLoading] = useState(true)

    console.log(user.accessToken);

    useEffect(() => {
        fetch('https://api-permeso.savenko.tech/api/private/users/profile/',
            {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`
                }
            })
            .then((res) => res.json())
            .then((data) => {
                setData(data.data)
                setLoading(false)
            })
    }, [user])

    if (isLoading) return <p>Loading...</p>
    if (!data) return <p>No profile data</p>
    if (!isLoading && !data.name) return (
        <div>
            Please enter your full name:
            <form onSubmit={(e) => {
                e.preventDefault()
                fetch('https://api-permeso.savenko.tech/api/private/users/profile/name',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${user.accessToken}`
                        },
                        body: JSON.stringify({name: e.target.name.value})
                    })
                    .then((res) => res.json())
                    .then((data) => {
                       // refresh the page
                        window.location.reload()
                    })
            }
            }>
                <input type="text" name="name" className="text-black" />
                <button type="submit">Submit</button>
            </form>
        </div>
    )

    return (
        <div>
            <h1>Your email: <b>{data.email}</b></h1>
            <h2>Your name: <b>{data.name}</b></h2>
            <button onClick={() => {
                fetch('https://api-permeso.savenko.tech/api/private/stripe/customers-portal-link',
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
            }}>Stripe Customers Portal</button>
        </div>
    )

}

export default Page;
