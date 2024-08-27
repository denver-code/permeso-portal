'use client'

import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { appConfig } from "@/app/config";
import { Navbar } from "@/components/common/navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";


function Page(): JSX.Element {
  const { user } = useAuthContext() as { user: any };
  const router = useRouter();
  const [membership, setMembership] = useState<MembershipResponse | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [showDangerousArea, setShowDangerousArea] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }

    const fetchData = async () => {
      try {
        const membershipResponse = await fetch(`${appConfig.apiURL}/api/private/users/membership/my`, {
          headers: { Authorization: `Bearer ${user.accessToken}` }
        });
        const membershipData = await membershipResponse.json();

        if (!membershipData) {
          router.push("/subscribe");
          return;
        }

        setMembership(membershipData);

        const planResponse = await fetch(`${appConfig.apiURL}/api/private/users/plans/${membershipData.plan_id}`, {
          headers: { Authorization: `Bearer ${user.accessToken}` }
        });
        const planData = await planResponse.json();
        setPlan(planData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, router]);

  const handleCancelMembership = async () => {
    try {
      await fetch(`${appConfig.apiURL}/api/private/users/membership/${membership?._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      router.push('/dashboard');
    } catch (error) {
      console.error("Error cancelling membership:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="mr-2 h-16 w-16 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <div className="flex-1 p-6 mx-auto container">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>{plan?.title}</CardTitle>
            <CardDescription>{plan?.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Price:</strong> £{plan?.price} per {plan?.interval}</p>
              <p><strong>Start Date:</strong> {membership?.period_start ? new Date(membership.period_start * 1000).toLocaleDateString() : 'N/A'}</p>
              <p><strong>End Date:</strong> {membership?.period_end ? new Date(membership.period_end * 1000).toLocaleDateString() : 'N/A'}</p>
              <p><strong>Status:</strong> {membership?.status}</p>
            </div>
            <Button className="mt-4" onClick={() => router.push('/selections')}>
              Manage My Selections
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col items-start">
            <Button variant="outline" onClick={() => setShowDangerousArea(!showDangerousArea)}>
              {showDangerousArea ? 'Hide Dangerous Area' : 'Show Dangerous Area'}
            </Button>
            {showDangerousArea && (
              <Dialog open={showCancelConfirmation} onOpenChange={setShowCancelConfirmation}>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="mt-4">Cancel Membership</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Canceling Membership | Dangerous Area</DialogTitle>
                    <DialogDescription>
                      Canceling your membership will remove your access to the platform. This action cannot be undone.
                      Your membership will become inactive immediately.
                      Are you sure you want to cancel your membership?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() =>{
                         setShowCancelConfirmation(false);

                         toast({
                            title: `Membership Kept!`,
                            description: "We're glad you've decided to keep your subscription! 😇",
                             });
                    }}>Keep Membership</Button>
                    <Button variant="destructive" onClick={handleCancelMembership}>Confirm Cancellation</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </CardFooter>
        </Card>
      </div>
     
    </div>
  );
}

export default Page;