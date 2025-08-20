"use client";

import { LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { RouteGuard } from "@/components/auth/route-guard";
import { useAuth } from "@/providers/auth-provider";
import { MAIN_NAVIGATION } from "@/constants/navigation";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";
import { cn } from "@/lib/utils";

function AppSidebar() {
  const { session, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <Sidebar>
      <SidebarContent>
        {/* Header */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-bold">
            RWA Dashboard
          </SidebarGroupLabel>
        </SidebarGroup>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {MAIN_NAVIGATION.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.href}
                      className={cn(
                        !pathname.startsWith(item.href) &&
                          "text-muted-foreground"
                      )}
                    >
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with user info and logout */}
      <SidebarFooter>
        <SidebarGroup>
          <div className="p-2 border-t">
            <div className="flex flex-col space-y-2">
              <div className="text-sm text-muted-foreground">
                <p className="font-medium">
                  {session.user?.first_name} {session.user?.last_name}
                </p>
                <p className="text-xs">{session.user?.email}</p>
                <p className="text-xs capitalize">{session.user?.user_type}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="w-full justify-start"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </Button>
            </div>
          </div>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard redirectTo="/login">
      <SidebarProvider>
        <QueryClientProvider client={queryClient}>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <main className="flex-1 flex flex-col">
              {/* Header */}
              <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger />
                <div className="flex-1" />
              </header>

              {/* Main content */}
              <div className="flex-1 p-4">{children}</div>
            </main>
          </div>
        </QueryClientProvider>
      </SidebarProvider>
    </RouteGuard>
  );
}
