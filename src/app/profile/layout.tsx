import { Metadata } from "next"
import Image from "next/image"

import { Separator } from "@/components/ui/separator"
import { SidebarNav } from "@/components/common/sidebarNav"
import { Navbar } from "@/components/common/navbar"

export const metadata: Metadata = {
  title: "Permeso | Settings",
  description: "Manage your account settings and set e-mail preferences.",
}

const sidebarNavItems = [
  {
    title: "Account",
    href: "/profile",
  },
  {
    title: "Security",
    href: "/profile/sections/security",
  },
  {
    title: "Billing",
    href: "/profile/sections/billing",
  },
  
]

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <>
        <Navbar />
      <div className=" space-y-6 p-10 pb-16 h-screen">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Account</h2>
          <p className="text-muted-foreground">
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div>
    </>
  )
}