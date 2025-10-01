"use client"
import { CircleUserRound, Box, GalleryVerticalEnd, ChartSpline, Boxes } from "lucide-react"
import * as React from "react"


import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "Jorge Elias",
  },
  teams: [
    {
      name: "Give me more",
      logo: GalleryVerticalEnd,
      plan: "Administracion",
    }
  ],
  navMain: [
    {
      title: "Productos",
      icon: Box,
      isActive: true,
      items: [
        {
          title: "Todos los productos",
          url: "/admin/products",
        },
        {
          title: "Agregar producto",
          url: "#",
        },
      ],
    },
    {
      title: "Usuarios",
      icon: CircleUserRound,
      url: "#",
      items: [
        {
          title: "Todos los usuarios",
          url: "#",
        },
        {
          title: "Agregar usuario",
          url: "#",
        },
      ],
    },
    {
      title: "Pedidos",
      icon: Boxes,
      url: "#",
      items: [
        {
          title: "Todos los pedidos",
          url: "#",
        },
        {
          title: "Agregar pedido",
          url: "#",
        },
      ],
    },
    {
      title: "Analitica",
      url: "#",
      icon: ChartSpline,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
}

export function AppSidebar({
  ...props
}) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
