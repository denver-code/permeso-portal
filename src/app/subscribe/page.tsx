'use client'

import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { appConfig } from "@/app/config";
import { Navbar } from "@/components/common/navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Plan {
  id: string;
  title: string;
  description: string;
  price: number;
  interval: string;
  total_uses: number;
  max_councils: number;
}

function Page(): JSX.Element {
  const { user } = useAuthContext() as { user: any };
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setLoading] = useState(true);

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
        if (membershipData != null) {
          router.push("/membership");
          return;
        }

        const plansResponse = await fetch(`${appConfig.apiURL}/api/private/users/plans/`, {
          headers: { Authorization: `Bearer ${user.accessToken}` }
        });
        const plansData = await plansResponse.json();
        setPlans(plansData.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [user, router]);

  const handleSubscribe = async (planId: string) => {
    try {
      const subscribeResponse = await fetch(
        `${appConfig.apiURL}/api/private/users/membership/subscribe/${planId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );

      if (subscribeResponse.ok) {
        const portalResponse = await fetch(`${appConfig.apiURL}/api/private/stripe/customers-portal-link`, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        });
        const portalData = await portalResponse.json();
        window.open(portalData.data);
      } else {
        alert('Failed to subscribe');
      }
    } catch (error) {
      console.error('Error:', error);
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
        <h1 className="text-3xl font-bold text-foreground pb-6">Choose a Plan</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card key={plan.id}>
              <CardHeader>
                <CardTitle>{plan.title}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">£{plan.price} <span className="text-sm font-normal">per {plan.interval}</span></p>
                <ul className="mt-4 space-y-2">
                  <li>{plan.total_uses} collections per week</li>
                  <li>Up to {plan.max_councils} Councils</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleSubscribe(plan.id)} className="w-full">
                  Subscribe
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Page;