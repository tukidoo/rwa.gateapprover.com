"use client";

import { useGetAllTenantOnboarding } from "@/hooks/api/tenant-onboarding";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

const TenantOnboardingPage = () => {
  const router = useRouter();
  const { data: tenantsData, isLoading } = useGetAllTenantOnboarding({
    page: 1,
  });

  const tenants = tenantsData?.data;

  const handleStartOnboarding = (tenantId: number) => {
    router.push(`/dashboard/tenant-onboarding/${tenantId}`);
  };

  return (
    <div className="space-y-6">
      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="p-4">
              <CardContent className="p-0">
                <div className="flex items-center space-x-3 mb-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-9 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && tenants?.length === 0 && (
        <div className="flex flex-col items-center space-y-4">
          <Users className="h-12 w-12 text-muted-foreground" />
          <div className="space-y-2">
            <p className="text-lg font-medium text-muted-foreground">
              No tenants found
            </p>
            <p className="text-sm text-muted-foreground">
              Tenant onboarding requests will appear here
            </p>
          </div>
        </div>
      )}

      {/* Tenant Cards */}
      {!isLoading && tenants && tenants.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tenants.map((tenant) => (
            <Card key={tenant.id}>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={tenant.profile_image_url || undefined}
                      alt={`${tenant.first_name} ${tenant.last_name}`}
                    />
                    <AvatarFallback>
                      {tenant.first_name.charAt(0)}
                      {tenant.last_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">
                      {tenant.first_name} {tenant.last_name}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => handleStartOnboarding(tenant.id)}
                >
                  <UserPlus className="size-4" />
                  Start Onboarding
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TenantOnboardingPage;
