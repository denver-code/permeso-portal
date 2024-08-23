"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from 'next/link';
import {useAuthContext} from "@/context/AuthContext";
import { Button } from '@/components/ui/button'
import { Card } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { JSX, SVGProps } from 'react';
import {HorizontalHero} from "@/components/common/horizontaHero";
import {Badge} from "@/components/ui/badge";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Terminal} from "lucide-react";

export default function Home() {
  const {user} = useAuthContext() as { user: any };

  return (
      <div className="text-foreground">
        <header className="px-4 lg:px-6 h-14 flex items-center">
          <div className="flex flex-row space-x-4">
            <Link href="/" className="flex items-center justify-center" prefetch={false}>
              <MountainIcon className="h-6 w-6 text-primary"/>
              <span className="sr-only">Permeso</span>
            </Link>
            <Link href="/" prefetch={false}>
              <span className="font-bold">Permeso</span>
            </Link>
            <Badge>Alpha | Early Access</Badge>
          </div>

          <nav className="ml-auto flex gap-4 sm:gap-6">

            {
              user ? (
                  <Link href="/dashboard">
                    <Button size="sm">Dashboard</Button>
                  </Link>
              ) : (
                 <div className="flex gap-4">
                     <Link href="/signin">
                        <Button size="sm">Sign In</Button>
                     </Link>
                    <Link href="/signup">
                            <Button size="sm">Sign Up</Button>
                      </Link>
                 </div>
              )

            }

          </nav>
        </header>

        <main>
          <HorizontalHero/>

          <section id="features" className="w-full ">
            <div className="container px-4 md:px-6 mx-auto">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm text-secondary-foreground">Key
                    Features
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    Streamline Finding New Clients Process
                  </h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Our service automates the tedious task of parsing council permissions data, generating PDF letters
                    for your clients, and streamlining your workflow. <br/>
                    With Us, you can get additional source of clients and increase your revenue.
                  </p>
                </div>
              </div>
              <div
                  className="mx-auto grid max-w-5xl items-center text-center md:text-start gap-6 py-12 lg:grid-cols-2 lg:gap-12">
                <div className="flex flex-col justify-center space-y-4">
                  <ul className="grid gap-6">
                    <li>
                      <div className="grid gap-1">
                        <h3 className="text-xl font-bold">Automated Parsing</h3>
                        <p className="text-muted-foreground">
                          Our service automatically extracts relevant permissions data from council websites daily,
                          saving you time and effort.
                        </p>
                      </div>
                    </li>
                    <li>
                      <div className="grid gap-1">
                        <h3 className="text-xl font-bold">Personalized PDF Letters</h3>
                        <p className="text-muted-foreground">
                          We generate customized PDF letters for your clients, complete with the parsed permissions
                          data.
                        </p>
                      </div>
                    </li>
                    <li>
                      <div className="grid gap-1">
                        <h3 className="text-xl font-bold">Streamlined Workflow</h3>
                        <p className="text-muted-foreground">
                          Integrate our service seamlessly into your existing workflow, reducing manual tasks and
                          improving efficiency.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
                <img
                    src="/placeholder.svg"
                    width="550"
                    height="310"
                    alt="Image"
                    className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                />
              </div>
            </div>
          </section>

          <section id="pricing" className="w-full">
            <div className="container px-4 md:px-6 mx-auto pt-4">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <div
                      className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">Pricing
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Affordable Pricing for Your Needs</h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Our pricing plans are designed to fit your budget and scale with your business.
                  </p>
                </div>
                <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
                  <Card className="border-primary p-6 space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold">Starter</h3>
                      <p className="text-primary text-4xl font-bold">£49.99</p>
                      <p className="text-muted-foreground">per week</p>
                    </div>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>
                        <CheckIcon className="mr-2 inline-block h-4 w-4 text-primary"/>
                        Up to 2 councils
                      </li>
                      <li>
                        <CheckIcon className="mr-2 inline-block h-4 w-4 text-primary"/>
                        1 Collection day per week
                      </li>
                      <li>
                        <UncheckedIcon className="mr-2 inline-block h-4 w-4 text-primary"/>
                        Personalized PDF letters <br/>
                      </li>
                      <li>
                        <CheckIcon className="mr-2 inline-block h-4 w-4 text-primary"/>
                        Basic support
                      </li>
                    </ul>
                    <Button className="w-full">Get Started</Button>
                  </Card>
                  <Card className="border-primary p-6 space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold">Pro</h3>
                      <span className="text-xs">Best Choice</span>
                      <p className="text-primary text-4xl font-bold">£249.99</p>
                      <p className="text-muted-foreground">per month</p>
                    </div>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>
                        <CheckIcon className="mr-2 inline-block h-4 w-4 text-primary"/>
                        Up to 25 councils
                      </li>
                      <li>
                        <CheckIcon className="mr-2 inline-block h-4 w-4 text-primary"/>
                        7 Collection days per week
                      </li>
                      <li>
                        <CheckIcon className="mr-2 inline-block h-4 w-4 text-primary"/>
                        Customizable filters
                      </li>
                      <span className="text-xs">(Drop applications that <br/> does not match your service)</span>
                      <li>
                        <CheckIcon className="mr-2 inline-block h-4 w-4 text-primary"/>
                        Personalized PDF letters
                      </li>
                      <li>
                        <CheckIcon className="mr-2 inline-block h-4 w-4 text-primary"/>
                        Priority support
                      </li>
                    </ul>
                    <Button className="w-full">Get Started</Button>
                  </Card>
                  <Card className="border-primary p-6 space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold">Enterprise</h3>
                      <p className="text-primary text-4xl font-bold">Custom</p>
                      <p className="text-muted-foreground">Tailored to your needs</p>
                    </div>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>
                        <CheckIcon className="mr-2 inline-block h-4 w-4 text-primary"/>
                        Unlimited council permissions parsed
                      </li>
                      <li>
                        <CheckIcon className="mr-2 inline-block h-4 w-4 text-primary"/>
                        7 Collection days per week
                      </li>
                      <li>
                        <CheckIcon className="mr-2 inline-block h-4 w-4 text-primary"/>
                        Customizable filters
                      </li>
                      <li>
                        <CheckIcon className="mr-2 inline-block h-4 w-4 text-primary"/>
                        Personalized PDF letters
                      </li>
                      <li>
                        <CheckIcon className="mr-2 inline-block h-4 w-4 text-primary"/>
                        Dedicated support
                      </li>
                    </ul>
                    <Button className="w-full">Contact Sales</Button>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          <section id="testimonials" className="w-full">
            <div className="container px-4 md:px-6 mx-auto">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <div
                      className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm text-secondary-foreground">Testimonials
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What Our Customers Say</h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Hear from our satisfied customers about how our service has transformed their council permissions
                    process.
                  </p>
                </div>
                <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
                  <Card className="border-primary p-6 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src="/placeholder-user.jpg" alt="@username"/>
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium leading-none">John Doe</p>
                          <p className="text-sm text-muted-foreground">Architect</p>
                        </div>
                      </div>
                      <p className="text-muted-foreground">
                        "Permeso has been a game-changer for our business."
                      </p>
                    </div>
                  </Card>
                  <Card className="border-primary p-6 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src="/placeholder-user.jpg" alt="@username"/>
                          <AvatarFallback>JA</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium leading-none">Jane Appleseed</p>
                          <p className="text-sm text-muted-foreground">Project Manager</p>
                        </div>
                      </div>
                      <p className="text-muted-foreground">
                        "I highly recommend Permeso to any business!"
                      </p>
                    </div>
                  </Card>

                </div>
              </div>
            </div>
          </section>

          <section id="testimonials" className="w-full">
            <div className="container px-4 md:px-6 mx-auto">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <div
                      className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm text-secondary-foreground">FAQ
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Frequently Asked Questions</h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    As we are in Alpha stage, we are still working on the FAQ section, please contact us if you have any
                    questions.

                  </p>
                </div>
                <div className="py-12 w-full max-w-3xl text-start">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>How do I know which councils supported?</AccordionTrigger>
                      <AccordionContent>
                        Coming soon....
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>How do I get started?</AccordionTrigger>
                      <AccordionContent>
                        Coming soon....
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>How do I contact support?</AccordionTrigger>
                      <AccordionContent>
                        Coming soon....
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                </div>
              </div>
            </div>
          </section>

          <section id="testimonials" className="w-full">
            <div className="container px-4 md:px-6 mx-auto">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <div
                      className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">Want more action?
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Start your automation journey <span className="font-black">Now</span>!</h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Join us today and start automation of gathering new potential clients process.
                  </p>
                </div>
                <div className="py-12 text-start">
                    <Button className="w-full" size="lg">Get Started</Button>

                </div>
              </div>
            </div>
          </section>


        </main>
      </div>
  )
}

function CheckIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
      <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
      >
        <path d="M20 6 9 17l-5-5"/>
      </svg>
  )
}

// UncheckedIcon
function UncheckedIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
      <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
      >
        <path d="M6 18 18 6M6 6l12 12"/>
      </svg>
  )
}

function MountainIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
      <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
      >
        <path d="m8 3 4 8 5-5 5 15H2L8 3z"/>
      </svg>
  )
}