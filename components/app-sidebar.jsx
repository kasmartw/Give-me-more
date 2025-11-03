"use client"
import { CircleUserRound, Box, GalleryVerticalEnd, ChartSpline, Boxes } from "lucide-react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const NAVIGATION = [
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
        url: "/admin/products/add-product",
      },
      {
        title: "Papelera",
        url: "/admin/products/trash-products",
      },
      {
        title: "Guardados",
        url: "/admin/products/draft-products"
      }
    ],
  },
  {
    title: "Usuarios",
    icon: CircleUserRound,
    items: [
      {
        title: "Todos los usuarios",
        url: "/admin/users-admin",
      },
      {
        title: "Agregar usuario",
        url: "/admin/users-admin/add-user",
      },
    ],
  },
  {
    title: "Pedidos",
    icon: Boxes,
    items: [
      {
        title: "Todos los pedidos",
        url: "/admin/orders",
      },
      {
        title: "Agregar pedido",
        url: "/admin/orders/add-order",
      },
    ],
  },
  {
    title: "Analitica",
    icon: ChartSpline,
    items: [
      {
        title: "General",
        url: "/admin/analytics",
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
];

const TEAMS = [
  {
    name: "Give me more",
    logo: GalleryVerticalEnd,
    plan: "Administracion",
  }
];

const FALLBACK_USER = {
  name: "Administrador",
  email: "admin@example.com",
};

export function AppSidebar({
  currentUser,
  ...props
}) {
  const sidebarUser = currentUser
    ? {
      name: currentUser.username ?? currentUser.name ?? FALLBACK_USER.name,
      email: currentUser.email || FALLBACK_USER.email,
    }
    : FALLBACK_USER;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={TEAMS} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={NAVIGATION} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
