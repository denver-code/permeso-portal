'use client'
import signIn from "@/firebase/auth/signIn";
import { useRouter } from 'next/navigation';
import {useEffect, useState} from "react";
import {useAuthContext, userSignOut} from "@/context/AuthContext";

function Page(): JSX.Element {
    const { user } = useAuthContext() as { user: any }; // Use 'as' to assert the type as { user: any }
    const router = useRouter();

    useEffect( () => {
        // Redirect to the home page if the user is not logged in
        if ( user == null ) {
            router.push( "/" );
        }

        userSignOut().then(() => {
            router.push("/");
        });

        // }, [ user ] );
    }, [ user, router ] ); // Include 'router' in the dependency array to resolve eslint warning


    return (
       <>
       </>
    );
}

export default Page;
