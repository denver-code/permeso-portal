"use client";
import Image from 'next/image'
import Link from 'next/link';
import {useAuthContext} from "@/context/AuthContext";
import { Button } from "@/components/ui/button"

export default function Home() {
  const { user } = useAuthContext() as { user: any };

  return (
    <main className="">
            <Button>Click me</Button>
    </main>
  )
}
