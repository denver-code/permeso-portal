"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { appConfig } from "../config";

export function AccountInfo(): JSX.Element {
  const { user } = useAuthContext() as { user: any };
  const [profile, setProfile] = useState<ProfileResponse["data"] | null>(null);
  const [isLoading, setLoading] = useState(true)
  const router = useRouter();

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
      <div>
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
      </div>

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