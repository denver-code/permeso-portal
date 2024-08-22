'use client'
import { useAuthContext } from "@/context/AuthContext";
import signIn from "@/firebase/auth/signIn";
import { sendPasswordResetEmail, getAuth } from "firebase/auth";
import { useRouter } from 'next/navigation';
import { useState } from "react";

function Page(): JSX.Element {
  const [ email, setEmail ] = useState( '' );

  const router = useRouter();

  // Handle form submission
  const handleForm = async ( event: { preventDefault: () => void } ) => {
    event.preventDefault();

    // Attempt to reset password with provided email
    try {
      await sendPasswordResetEmail( getAuth(), email );
    } catch ( error ) {
      // Display and log any sign-in errors
      console.log( error );
      return;
    }
    

    // Redirect to the admin page
    // Typically you would want to redirect them to a protected page an add a check to see if they are admin or 
    // create a new page for admin
    router.push( "/signin" );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-full max-w-xs">
        <form onSubmit={handleForm} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h1 className="text-3xl font-bold mb-6 text-black">Reset Password</h1>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              onChange={( e ) => setEmail( e.target.value )}
              required
              type="email"
              name="email"
              id="email"
              placeholder="example@mail.com"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-semibold py-2 rounded"
            >
              Reset
            </button>

           
          </div>
        </form>
      </div>
    </div>
  );
}

export default Page;
