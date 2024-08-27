"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { MountainIcon } from "lucide-react";


export function PublicNavbar(){
    const {user} = useAuthContext() as { user: any };
    
    return (
        <header className="px-4 lg:px-6 h-14 flex items-center">
          <div className="flex flex-row space-x-4">
            <Link href="/" className="flex items-center justify-center" prefetch={false}>
              <MountainIcon className="h-6 w-6 text-primary"/>
              <span className="sr-only">Permeso</span>
            </Link>
            <Link href="/" prefetch={false}>
              <span className="font-bold">Permeso</span>
            </Link>
            <Link href='/alpha-version-notice'>
              <Badge>Alpha | Early Access</Badge>
            </Link>
          </div>

          <nav className="ml-auto flex gap-4 sm:gap-6">
            {
                user ? (
                    <div className="mr-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button size="sm" asChild>
                            <Link href={"/dashboard"}>Account</Link>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem asChild>
                            <Link href={"/dashboard"}>Dashboard</Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator/>
                          <DropdownMenuItem asChild>
                            <Link href={"/logout"}>Logout</Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                ) : (
                  <div className="mr-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button size="sm">Menu</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem asChild>
                          <Link href={"/signin"}>Sign In</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={"/signup"}>Sign Up</Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )
            }

          </nav>
        </header>
    )
}