'use client'
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import { useClipboard } from '@mantine/hooks';
import { IconCopy, IconCheck } from '@tabler/icons-react';
import { appConfig } from "@/app/config";


function Page(): JSX.Element {
    // Access the user object from the authentication context
    // const { user } = useAuthContext();
    const { user } = useAuthContext() as { user: any }; // Use 'as' to assert the type as { user: any }
    const router = useRouter();
    const [data, setData] = useState(null)
    const [isLoading, setLoading] = useState(true)
    const clipboard = useClipboard();

    console.log(user.accessToken);

    useEffect(() => {
        fetch(appConfig.apiURL + '/api/private/users/profile/',
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
                fetch(appConfig.apiURL + '/api/private/users/profile/name',
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

    function ProfileSection() {
        return <>
            <div className="space-y-2 max-w-full">
                <h1 className="text-2xl font-semibold pl-8">Profile</h1>
                <div className="flex flex-col container mx-auto px-7 py-7 bg-black rounded-lg border border-zinc-700 w-full divide-y divide-zinc-800">

                <div className="flex flex-row justify-between py-6 items-baseline">
                  <div className="flex flex-row space-x-24">
                    <h1 className="text-xl w-24">Full Name</h1>
                     <h1 className="text-xl font-semibold">{data.name}</h1>
                  </div>
                  <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-2 rounded inline-flex items-center">
                      <span>Manage</span>
                  </button>
                </div>


                <div className="flex flex-row justify-between py-6 items-baseline">
                  <div className="flex flex-row space-x-24">
                    <h1 className="text-xl w-24">Email</h1>
                     <h1 className="text-xl font-semibold">{data.email}</h1>
                  </div>
                </div>
            </div>
            </div>
        </>
    }

    function SecuritySection(){
        return <>
             <div className="space-y-2 max-w-full">
                <h1 className="text-2xl font-semibold pl-8">Security</h1>
                <div className="flex flex-col container mx-auto px-7 py-7 bg-black rounded-lg border border-zinc-700 w-full divide-y divide-zinc-800">

                <div className="flex flex-row justify-between py-6 items-baseline">
                  <div className="flex flex-row space-x-24">
                    <h1 className="text-xl w-24">Password</h1>
                     <h1 className="text-xl font-semibold">*********</h1>
                  </div>
                  <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-2 rounded inline-flex items-center">
                      <span>Change</span>
                  </button>
                </div>

                <div className="flex flex-row justify-between py-6 items-baseline">
                  <div className="flex flex-row space-x-12">
                    <h1 className="text-xl">PAT</h1>
                    {/* Activated Badge */}
                    <div className="bg-green-500 text-white py-1 px-2 rounded inline-flex items-center">
                        <span>Activated</span>
                    </div>
                    {/* Copy to clipboard button */}
                    <div className="flex flex-row space-x-2 w-28">
                        <button onClick={() => {
                            clipboard.copy("HELLO WORLD!")
                        }} className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-2 rounded inline-flex items-center">
                            <span>Copy</span>
                        </button>
                        {clipboard.copied && <IconCheck size={24} color="green" />}
                    </div>

                     <div className="flex flex-row space-x-2">
                        <button onClick={() => {
                            // refresh the page
                            window.location.reload()
                        }} className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-2 rounded inline-flex items-center">
                            <span>Deactivate</span>
                        </button>
                    </div>

                  </div>
                </div>
            </div>
            </div>
        </>
    }

    function Billing(){
        return <>
            <div className="space-y-2 max-w-full">
                <h1 className="text-2xl font-semibold pl-8">Billing</h1>
                <div className="flex flex-col container mx-auto px-7 py-7 bg-black rounded-lg border border-zinc-700 w-full divide-y divide-zinc-800">

                <div className="flex flex-row justify-between py-6 items-baseline">
                  <div className="flex flex-row space-x-24">
                    <h1 className="text-xl">Stripe Dashboard</h1>
                   
                  </div>
                  <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-2 rounded inline-flex items-center" onClick={()=>{
                     fetch(`${appConfig.apiURL}/api/private/stripe/customers-portal-link`,
                        {
                            headers: {
                                Authorization: `Bearer ${user.accessToken}`
                            }
                        })
                        .then((res) => res.json())
                        .then((data) => {
                            console.log(data.data)
                            window.open(data.data, '_blank')

                        })
                  }}>
                      <span>Open</span>
                  </button>
                </div>
            </div>
            </div>
        </>
    }

    return (
        <div className="flex flex-col min-h-screen bg-black">
            <Navbar />

            <div className="flex-1 flex flex-col items-center mt-24">
                <div className="w-full max-w-2xl p-4 space-y-5">
                    <ProfileSection />
                    <SecuritySection />
                    <Billing />
                </div>
            </div>
        
        </div>
        
    )

}

export default Page;
