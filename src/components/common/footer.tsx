'use client'
import Link from 'next/link'
import Typography from '@/components/ui/typography'
import {Badge} from "@/components/ui/badge";
import {MountainIcon} from "lucide-react";

export function Footer() {
  return (
      <footer className="py-6 md:px-8 md:py-0 ">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
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

            Built by{" "}
            <a
                href="https://savenko.tech/about"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
            >
              Ihor Savenko
            </a>
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy">
              <span className="text-sm text-muted-foreground">Privacy Policy</span>
            </Link>
            <Link href="/terms-of-service">
              <span className="text-sm text-muted-foreground">Terms of Service</span>
            </Link>
          </div>
        </div>
      </footer>
  )
}