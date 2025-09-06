import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { UnitDetailsClient } from "./unit-details-client";

interface UnitDetailsPageProps {
  params: Promise<{
    unit_id: string;
  }>;
}

export default async function UnitDetailsPage({ params }: UnitDetailsPageProps) {
  const { unit_id } = await params;
  const unitId = unit_id;
  return (
    <div className="space-y-6">
      {/* Back Link */}
      <div>
        <Button variant="ghost" size="sm" asChild className="text-gray-800 hover:text-gray-900 hover:bg-purple-50">
          <Link href="/dashboard/building-management/manage-units" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Manage Units
          </Link>
        </Button>
      </div>

      {/* Page Header with Wow Factor */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#7d51ff] via-[#9d71ff] to-[#b591ff] p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
        <div className="relative">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Unit Details</h1>
          <p className="text-purple-100 text-lg">
            Detailed information for this unit
          </p>
        </div>
      </div>

      {/* Client Component for Data Fetching */}
      <UnitDetailsClient unitId={unitId} />
    </div>
  );
}