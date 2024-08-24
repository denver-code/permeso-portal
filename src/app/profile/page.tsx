import { Separator } from "@/components/ui/separator"
import { AccountInfo } from "./account"

export default function SettingsProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account</h3>
        <p className="text-sm text-muted-foreground">
          This is your main account information.
        </p>
      </div>
      <Separator />
      <AccountInfo />
    </div>
  )
}