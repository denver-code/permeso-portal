"use client"

import * as React from "react"

import { Github, Loader }   from "lucide-react";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {useState} from "react";
import {useRouter} from "next/navigation";
import signIn from "@/firebase/auth/signIn";
import {toast, useToast} from "@/components/ui/use-toast"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const router = useRouter();
    const { toast } = useToast()
    // Handle form submission

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault()
        setIsLoading(true)

        // Get form data
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);

        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if ( !email || !password ) {
            // Display and log any sign-in errors
            console.log( "Email and password are required" );
            return;
        }
        // Attempt to sign in with provided email and password
        const { result, error } = await signIn( email, password );

        if ( error ) {
            // Display and log any sign-in errors
            console.log( error );
            setIsLoading( false );
            // @ts-ignore
            toast(
                {
                    title: "Error",
                    description: error.message,
                }
            )
            return;
        }

        router.push( "/dashboard" );
    }

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <form onSubmit={onSubmit}>
                <div className="grid gap-2">
                    <div className="grid gap-1">
                        <Label className="sr-only" htmlFor="email">
                            Email
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            placeholder="name@example.com"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            disabled={isLoading}
                        />
                    </div>
                    <div className="grid gap-1">
                        <Label className="sr-only" htmlFor="email">
                            Password
                        </Label>
                        <Input
                            id="password"
                            name="password"
                            placeholder="********"
                            type="password"
                            autoCapitalize="none"
                            autoCorrect="off"
                            disabled={isLoading}
                        />
                    </div>
                    <Button disabled={isLoading}>
                        {isLoading && (
                            <Loader className="mr-2 h-4 w-4 animate-spin"/>
                        )}
                        Sign In
                    </Button>
                </div>
            </form>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t"/>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
                </div>
            </div>
            <Button variant="outline" type="button" disabled={isLoading}>
                {isLoading ? (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Github className="mr-2 h-4 w-4" />
                )}{" "}
                GitHub
            </Button>
        </div>
    )
}