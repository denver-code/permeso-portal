'use client'
import signIn from "@/firebase/auth/signIn";
import { useRouter } from 'next/navigation';
import React, { useState } from "react";
import {UserAuthForm} from "@/components/common/userAuthForm";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import { CommandIcon} from "lucide-react";

function Page(): JSX.Element {
  return (
      <>
        <div className="container h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
          <Link
              href="/signin"
              className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "absolute right-4 top-4 md:right-8 md:top-8"
              )}
          >
            Sign in
          </Link>
          <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
            <div className="absolute inset-0 bg-zinc-900" />
            <div className="relative z-20 flex items-center text-lg font-medium">
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-6 w-6"
              >
                <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
              </svg>
              Permeso
            </div>
            <div className="relative z-20 mt-auto">
              <blockquote className="space-y-2">
                <p className="text-lg">
                  &ldquo;Hey! Hope you have good experience using our portal!.&rdquo;
                </p>
                <footer className="text-sm">Ihor Savenko</footer>
              </blockquote>
            </div>
          </div>
          <div className="lg:p-8">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] mt-32">
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Continue with new account
                </h1>
                <p className="text-sm text-muted-foreground">
                  Enter your email below to create your new account
                </p>
              </div>
              <UserAuthForm isSignIn={false}/>
              <p className="px-8 text-center text-sm text-muted-foreground">
                By clicking continue, you agree to our{" "}
                <Link
                    href="/terms-of-service"
                    className="underline underline-offset-4 hover:text-primary"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                    href="/privacy-policy"
                    className="underline underline-offset-4 hover:text-primary"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </>
  );
}

export default Page;
