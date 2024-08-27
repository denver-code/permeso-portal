"use client"

import { appConfig } from "@/app/config";
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { useAuthContext } from "@/context/AuthContext";

export function BillingInfo() {
  const { user } = useAuthContext() as { user: any };
  
  const requestChange = (field: string) => {
    toast({
      title: `Request a Change of ${field}`,
      description: "This feature is not available yet. Please contact Technical Support for assistance.",
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold mb-2">Stripe Customer Portal</h2>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="mt-2"
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
          }}
        >
          Open Portal
        </Button>
        <p className="text-sm text-gray-500 mt-2">
         We&apos;re using Stripe to manage your billing information. You can change your billing information via Stripe Customer Portal.
        </p>
      </div>
    </div>
  )
}