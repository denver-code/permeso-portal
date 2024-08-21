'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import firebase_app from '@/firebase/config';
import {LoaderIndicator} from "@/app/components/LoaderIndicator";

// Initialize Firebase auth instance
const auth = getAuth( firebase_app );

// Create the authentication context
export const AuthContext = createContext( {} );

// Custom hook to access the authentication context
export const useAuthContext = () => useContext( AuthContext );

interface AuthContextProviderProps {
  children: ReactNode;
}


export function userSignOut() {
  return auth.signOut();
}

export function AuthContextProvider( { children }: AuthContextProviderProps ): JSX.Element {
  // Set up state to track the authenticated user and loading status
  const [ user, setUser ] = useState<User | null>( null );
  const [ loading, setLoading ] = useState( true );

  useEffect( () => {
    // Subscribe to the authentication state changes
    const unsubscribe = onAuthStateChanged( auth, ( user ) => {
      if ( user ) {
        // User is signed in
        setUser( user );
      } else {
        // User is signed out
        setUser( null );
      }
      // Set loading to false once authentication state is determined
      setLoading( false );
    } );

    // Unsubscribe from the authentication state changes when the component is unmounted
    return () => unsubscribe();
  }, [] );

  // Provide the authentication context to child components
  return (
    <AuthContext.Provider value={{ user }}>
      {loading ? (
          <LoaderIndicator/>
      ) : (
          user ? (
              user.emailVerified ? (
                  children
              ) : (
                  <div className="flex items-center justify-center h-screen black">
                    <div className="bg-black p-8 rounded-lg shadow-lg">
                      <h2 className="text-2xl font-bold text-white mb-4">Verified email required.</h2>
                      <p className="text-gray-400 mb-6">
                        Please check your inbox and click the link to verify your email address. <br/>
                        Once verified, you will need to refresh the page!
                      </p>
                      <button
                          className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                          onClick={() => {
                            window.location.reload();
                          }}>
                        Refresh Page
                      </button>
                    </div>
                  </div>
              )
          ) : (
              children
          )
      )}



    </AuthContext.Provider>
  );
}

