"use client";
import Link from 'next/link';
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

export function HorizontalHero() {
    const router = useRouter();

    return (
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 ">
            <div className="container px-4 md:px-6 mx-auto">
                <div
                    className="grid gap-12 lg:grid-cols-[1fr_400px] lg:gap-20 xl:grid-cols-[1fr_600px]">
                    <div className="flex flex-col justify-center space-y-4 text-start">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                                Effortless Planning Applications Parsing
                            </h1>
                            <p className="max-w-[600px] text-gray-400 md:text-xl ">
                                Automatically parse planning applications data from council websites and generate personalized PDF
                                letters that are ready to be send to your new potential clients!
                            </p>
                        </div>
                        <div className="flex flex-col gap-4 min-[400px]:flex-row">
                            <Button size="lg" onClick={()=>{
                                router.push("/signup")
                            }}>
                                Get Started
                            </Button>
                             <Button size="lg" onClick={()=>{
                                router.push("/signup")
                            }} variant="secondary" >
                                Watch Demo
                            </Button>
                        </div>
                    </div>
                    <img
                        src="/demo1.png"
                        width="550"
                        height="550"
                        alt="Hero"
                        className="mx-auto overflow-hidden rounded-xl object-cover lg:order-last aspect-square"
                    />
                </div>
            </div>
        </section>
    )
}