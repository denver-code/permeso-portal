'use client'
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { appConfig } from "@/app/config";
import { MainNav } from "@/components/common/main-nav";
import { UserNav } from "@/components/common/user-nav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { MountainIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";


export function Navbar(){
    return (
        <div className="border-b">
        <div className="flex h-16 items-center px-4">
        <div className="flex flex-row space-x-4">
        <Link href="/" className="flex items-center justify-center" prefetch={false}>
          <MountainIcon className="h-6 w-6 text-primary"/>
          <span className="sr-only">Permeso</span>
        </Link>
        <Link href="/dashboard" prefetch={false}>
          <span className="font-bold">Permeso</span>
        </Link>
        <Badge className="hidden md:block">Alpha | Early Access</Badge>
      </div>
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav/>
          </div>
        </div>
      </div>
    )
}