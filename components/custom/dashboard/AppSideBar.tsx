"use client";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { ProgressIndicator } from "@/components/ui/progress";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Progress } from "@/components/ui/progress";
import { Archive, LayoutGrid, Settings, Sparkles, User } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export function AppSidebar() {
  const path = usePathname();

  const {user} = useUser();
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Logo" width={40} height={40} />
          <h2 className="text-xl font-bold">WhizBoard</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <Button>+ Create New Board</Button>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>My Boards</SidebarGroupLabel>
          <SidebarMenuButton className="p-5" isActive={path === "/dashboard"}>
            <LayoutGrid />
            <span>All files</span>
          </SidebarMenuButton>
          <SidebarMenuButton
            className="p-5 mt-2"
            isActive={path === "/shared-file"}
          >
            <User />
            <span>Shared</span>
          </SidebarMenuButton>
          <SidebarMenuButton
            className="p-5 mt-2"
            isActive={path === "/archived"}
          >
            <Archive />
            <span>Archived</span>
          </SidebarMenuButton>
        </SidebarGroup>

        <SidebarGroupLabel>Others</SidebarGroupLabel>
        <SidebarMenuButton
          className="p-5 mt-2"
          isActive={path === "/ai"}
        >
          <Sparkles />
          <span>AI Helper</span>
        </SidebarMenuButton>
        <SidebarMenuButton
          className="p-5 mt-2"
          isActive={path === "/setting"}
        >
          <Settings />
          <span>Setting</span>
        </SidebarMenuButton>
        <SidebarGroup></SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button>+ Create New Board</Button>
        <div>
            <h2 className="text-sm flex justify-between">2 files created <span>total 3</span></h2>
            <Progress value = {20} className = "h-2 mt-2"/>
        </div>

        <div className="flex items-center gap-2 p-4 border rounded-md">
            <Image src = {user?.imageUrl??''} alt="User Image" width={40} height={40}
            className="rounded-full"
            />
            <h2>{user?.firstName} {user?.lastName}</h2>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
