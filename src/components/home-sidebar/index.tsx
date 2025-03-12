import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { Mainsection } from "./main-section";

export const HomeSideBar = () => {
  return (
    <Sidebar className="pt-16 z-40 border-none" collapsible="icon" variant=  "sidebar">
      <SidebarContent className="bg-background">
        <Mainsection />
        <Separator />
      </SidebarContent>
    </Sidebar>
  );
};
