'use client'
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {useState, useEffect, FormEvent} from "react";
import Navbar from "../components/navbar";
import { useClipboard } from '@mantine/hooks';
import { IconCopy, IconCheck } from '@tabler/icons-react';
import { appConfig } from "@/app/config";
import { sendPasswordResetEmail } from "firebase/auth";
import {LoaderIndicator} from "@/app/components/LoaderIndicator";

interface ProfileResponse {
    data: {
        email: string | "";
        name: string | "";
    };
    status: string;
}

interface PATResponse {
    data: {
        pat: string;
        is_active: boolean;
    };
    status: string;
}

function Page(): JSX.Element {
    const { user } = useAuthContext() as { user: any };
    const [profile, setProfile] = useState<ProfileResponse["data"] | null>(null);
    const [pat, setPat] = useState<PATResponse["data"] | null>(null);
    const [isLoading, setLoading] = useState(true)
    const clipboard = useClipboard();
    const router = useRouter();
    // console.log(user.accessToken);


    useEffect(() => {
          if (user == null) {
            return router.push("/");
        }
        fetch(appConfig.apiURL + '/api/private/users/profile/',
            {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`
                }
            })
            .then((res) => res.json())
            .then((data) => {
                setProfile(data.data)
                 fetch(appConfig.apiURL + '/api/private/users/profile/security/pat',{
                    headers: {
                        Authorization: `Bearer ${user.accessToken}`
                    }
                })
                .then((res) => res.json())
                .then((data) => {
                    setPat(data.data)
                    setLoading(false)
                })
            })

       
    }, [user])



    if (isLoading) return <p><LoaderIndicator/></p>
    if (!profile) return <p>No profile data, please reload the page, or contact technical support.</p>

    if (!isLoading && !profile.name) {
        return (
            <div className="flex items-center justify-center h-screen bg-black">
                <div className="bg-zinc-900 p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-2xl font-bold text-white mb-4">
                        Please enter your full name:
                    </h2>
                    <form
                        onSubmit={(e: FormEvent<HTMLFormElement>) => {
                            e.preventDefault();

                            const formData = new FormData(e.currentTarget)
                            const name = formData.get('name') as string;
                            if (!name) return alert('Please enter your full name');

                            fetch(`${appConfig.apiURL}/api/private/users/profile/name`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${user.accessToken}`,
                                },
                                body: JSON.stringify({
                                    name
                                }),
                            })
                                .then((res) => res.json())
                                .then((data) => {
                                    // refresh the page
                                    // window.location.reload();
                                    router.push('/subscribe')
                                })
                             .catch((err) => console.error("Error:", err))
                        }}
                        className="space-y-4"
                    >
                        <input
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Full Name"
                            className="bg-zinc-800 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-white w-full"
                        />
                        <button
                            type="submit"
                            className="bg-black hover:bg-zinc-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    function ProfileSection() {
        return <>
            <div className="space-y-2 max-w-full">
                <h1 className="text-2xl font-semibold pl-8">Profile</h1>
                <div className="flex flex-col container mx-auto px-7 py-7 bg-black rounded-lg border border-zinc-700 w-full divide-y divide-zinc-800">

                <div className="flex flex-row justify-between py-6 items-baseline">
                  <div className="flex flex-row space-x-16 md:space-x-24">
                    <h1 className="text-xl sw-24 md:w-24">Full Name</h1>
                     <h1 className="text-xl font-semibold">{profile?.name}</h1>
                  </div>
                  {/*<button className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-2 rounded inline-flex items-center">*/}
                  {/*    <span>Manage</span>*/}
                  {/*</button>*/}
                </div>


                <div className="flex flex-row justify-between py-6 items-baseline">
                  <div className="flex flex-row space-x-16 md:space-x-24">
                    <h1 className="text-xl sw-24 md:w-24">Email</h1>
                     <h1 className="text-xl font-semibold">{profile?.email}</h1>
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
                  <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-2 rounded inline-flex items-center" onClick={()=>{
                        sendPasswordResetEmail(user.auth, user.email).then(() => {
                            alert('Password reset email sent to your email address')
                        }
                        ).catch((err) => {
                            console.error(err)
                        })
                  }}>
                     <span>Reset</span>
                  </button>
                </div>

                <div className="flex flex-row justify-between py-6 items-baseline">
                  <div className="flex flex-row space-x-4 md:space-x-12">
                    <h1 className="text-xl">PAT</h1>
                      { pat?.is_active ? <>
                          <div className="bg-green-500 text-white py-1 px-2 rounded inline-flex items-center">
                              <span>Activated</span>
                          </div>
                          {/* Copy to clipboard button */}
                          <div className="flex flex-row space-x-2 w-12">
                              <button onClick={() => {
                                  clipboard.copy(pat?.pat)
                              }}
                                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-2 rounded inline-flex items-center">
                                  <span>Copy</span>
                              </button>
                              {clipboard.copied && <IconCheck size={24} color="green"/>}
                          </div>

                          <div className="flex flex-row space-x-2">
                              <button onClick={() => {
                                  fetch(appConfig.apiURL + '/api/private/users/profile/security/pat/deactivate',
                                      {
                                          method: 'PATCH',
                                          headers: {
                                              Authorization: `Bearer ${user.accessToken}`
                                          }
                                      })
                                      .then((res) => res.json())
                                      .then((data) => {
                                              // refresh the page
                                              window.location.reload()
                                          }
                                      )
                              }}
                                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-2 rounded inline-flex items-center">
                                  <span>Deactivate</span>
                              </button>
                          </div>
                      </> : <>
                          <div className="bg-red-500 text-white py-1 px-2 rounded inline-flex items-center">
                              <span>Deactivated</span>
                          </div>
                            <button onClick={() => {
                                // refresh the page
                                fetch(appConfig.apiURL + '/api/private/users/profile/security/pat/activate',
                                    {
                                        method: 'PATCH',
                                        headers: {
                                            Authorization: `Bearer ${user.accessToken}`
                                        }
                                    })
                                    .then((res) => res.json())
                                    .then((data) => {
                                            // refresh the page
                                            window.location.reload()
                                        }
                                    )
                            }}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-2 rounded inline-flex items-center">
                                <span>Activate</span>
                            </button>
                      </>}


                  </div>
                </div>
                </div>
             </div>
        </>
    }

    function Billing() {
        return <>
        <div className="space-y-2 max-w-full">
                <h1 className="text-2xl font-semibold pl-8">Billing</h1>
                <div
                    className="flex flex-col container mx-auto px-7 py-7 bg-black rounded-lg border border-zinc-700 w-full divide-y divide-zinc-800">

                    <div className="flex flex-row justify-between py-6 items-baseline">
                        <div className="flex flex-row space-x-24">
                            <h1 className="text-xl">Stripe Dashboard</h1>

                        </div>
                        <button
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-2 rounded inline-flex items-center"
                            onClick={() => {
                                fetch(`${appConfig.apiURL}/api/private/stripe/customers-portal-link`,
                                    {
                                        headers: {
                                Authorization: `Bearer ${user.accessToken}`
                            }
                        })
                        .then((res) => res.json())
                        .then((data) => {
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
