"use client"

import { appConfig } from "@/app/config";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast"
import { useAuthContext } from "@/context/AuthContext";
import { useClipboard } from "@mantine/hooks";
import { sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function SecurityInfo() {
  const { user } = useAuthContext() as { user: any };
  const [pat, setPat] = useState<PATResponse["data"] | null>(null);
  const [profile, setProfile] = useState<ProfileResponse["data"] | null>(null);
  const [isLoading, setLoading] = useState(true)
  const clipboard = useClipboard();
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
        if (data.data.has_pat){
          console.log("Fetching PAT")
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
        }

        setLoading(false)
    })


 
}, [user])

if (isLoading) return <>
    <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white" />
    </div>

  </>;

  function requestResetPassword() {
      sendPasswordResetEmail(user.auth, user.email).then(() => {
        toast({
          title: `Password Reset Email Sent`,
          description: "Please check your email for instructions to reset your password.",
        })
    }
    ).catch((err) => {
        console.error(err)
    })
}

  const requestChange = (field: string) => {
    toast({
      title: `Request a Change of ${field}`,
      description: "This feature is not available yet. Please contact Technical Support for assistance.",
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold mb-2">Password</h2>
        <h3 className="text-lg font-medium">***************</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => requestResetPassword()}
        >
          Reset Password
        </Button>
       
      </div>

      <div>
        <div className="flex space-x-4">
        <h2 className="text-lg font-semibold mb-2">PAT</h2>
          <div>
          { 
            profile?.has_pat ? <Badge variant={
              pat?.is_active ? "default" : "destructive"
          }>
              {pat?.is_active ? "Active" : "Inactive"}
            </Badge> : <Badge variant="destructive">Inactive</Badge>
          }
          </div>
         </div>
       
         {
          profile?.has_pat ? <>
          <div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
            <Button variant="outline" onClick={()=>{
              clipboard.copy(pat?.pat)
              toast({
                title: `PAT copied to clipboard`,
                description: "Please store this token in secure place, do not share it with anyone.",
              })
            }}><h3 className="text-lg font-medium">{pat?.pat.slice(0,2)}*******************************{pat?.pat.slice(-3)}</h3></Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Please store this token in secure place, do not share it with anyone.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <p className="text-sm text-muted-foreground ml-2">
          Click the PAT token to copy it to your clipboard!
        </p>
        </div>
       
       <div className="flex space-x-4 flex-row">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => {
            fetch(appConfig.apiURL + `/api/private/users/profile/security/pat/${pat?.is_active ? "deactivate" : "activate"}`,{
              method: 'PATCH',
              headers: {
                  Authorization: `Bearer ${user.accessToken}`,
              },
          })
          .then((res) => res.json())
          .then((data) => {
            window.location.reload()  
          }
          )
          }}
        >
         {
            pat?.is_active ? "Deactivate" : "Activate"
         }
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => {
            fetch(appConfig.apiURL + '/api/private/users/profile/security/pat',{
              method: 'DELETE',
              headers: {
                  Authorization: `Bearer ${user.accessToken}`,
              },
          })
          .then((res) => res.json())
          .then((data) => {
            window.location.reload()  
          })
          }}
        >
          Delete PAT
        </Button>
       
       </div>
       <p className="text-sm text-gray-500 mt-2">
          This is your PAT token, which is used to authenticate with the API if you are using a third-party application. <br/>
          Our documentation provides more information on how to use this token.
        </p>
        </>
       : <div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => {
              fetch(appConfig.apiURL + '/api/private/users/profile/security/pat',{
                headers: {
                    Authorization: `Bearer ${user.accessToken}`,
                },
            })
            .then((res) => res.json())
            .then((data) => {
              window.location.reload()  
            })
            }}
          >
            Create PAT
          </Button>
          <p className="text-sm text-gray-500 mt-2">
            This is your PAT token, which is used to authenticate with the API if you are using a third-party application. <br/>
            Our documentation provides more information on how to use this token.
          </p>
        </div>
         }
       
      </div>
    </div>
  )
}