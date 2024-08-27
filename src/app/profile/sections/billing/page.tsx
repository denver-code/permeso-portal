import { Separator } from "@/components/ui/separator"
import { BillingInfo } from "./billing"

export default function SettingsAppearancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Billing</h3>
        <p className="text-sm text-muted-foreground">
          Manage your billing information. Change your payment method, view invoices, and more.
        </p>
      </div>
      <Separator />
      <BillingInfo />
    </div>
  )
}