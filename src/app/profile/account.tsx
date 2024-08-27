"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { appConfig } from "../config";

import {  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage, } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronDownIcon } from "@radix-ui/react-icons"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {getAuth, updateProfile} from "firebase/auth";

 
const formSchema = z.object({
  fullname: z.string().min(4).max(50),
})

export function AccountInfo(): JSX.Element {
  const { user } = useAuthContext() as { user: any };
  const [profile, setProfile] = useState<ProfileResponse["data"] | null>(null);
  const [isLoading, setLoading] = useState(true)
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // /api/private/users/profile/name

    const auth = getAuth();

    fetch(appConfig.apiURL + '/api/private/users/profile/name', {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: values.fullname,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        toast({
          title: "Full Name Updated",
          description: "Your full name has been updated successfully.",
        })
        
        if (auth.currentUser) {
          updateProfile(auth.currentUser, {
              displayName: values.fullname
          }).then(() => {
              console.log("Firebase name updated successfully");
          }).catch((error) => {
              console.error("Error updating Firebase name:", error);
          });
        
      }    
      router.push('/subscribe')
      })
    
  }

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
          setLoading(false)
      })

 
}, [user])

if (isLoading) return <>
    <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white" />
    </div>
</>;


  const requestChange = (field: string) => {
    toast({
      title: `Request a Change of ${field}`,
      description: "This feature is not available yet. Please contact Technical Support for assistance.",
    })
  }

  return (
    <div className="space-y-8">
      {
        user.displayName ? <div>
        <h2 className="text-lg font-semibold mb-2">Full Name</h2>
        <h3 className="text-lg font-medium">{profile?.name}</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => requestChange("Name")}
        >
          Request Change
        </Button>
        <p className="text-sm text-gray-500 mt-2">
          This is your legal full name. You can change it only via Technical Support request with a valid reason and valid ID proof.
        </p>
      </div> : <div>
        <h1 className="text-2xl font-semibold mb-2">Fill your Legal Full Name to Countinue!</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                  <FormControl>
                    <Input placeholder="Full Name" {...field} />
                  </FormControl>
                  </FormControl>
                  <FormDescription>
                      It is MUST to be your legal full name. You can change it only via Technical Support request with a valid reason and valid ID proof.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Save Name</Button>
          </form>
        </Form>

        </div>
      }

      <div>
        <h2 className="text-lg font-semibold mb-2">Email</h2>
        <h3 className="text-lg font-medium">{profile?.email}</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => requestChange("Email")}
        >
          Request Change
        </Button>
        <p className="text-sm text-gray-500 mt-2">
          This is your email address. You can change it only via Technical Support request with a valid reason.
        </p>
      </div>
    </div>
  )
}