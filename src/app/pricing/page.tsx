// app/pricing/page.tsx
import { SubscriptionCards } from "@/components/pricing/SubscriptionCards";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50">
      <SubscriptionCards />
    </div>
  );
}
