"use client"

import * as React from "react"
import { IconArticle, IconDashboard, IconListDetails, IconUsers, IconSettings, IconHelp, IconSearch, IconDatabase, IconReport, IconFileWord } from "@tabler/icons-react"

// import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/sidebar/nav-main"
// import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/sidebar/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import Image from "next/image"
import logo from "@/public/pichakubwalogo.webp"

const data = {
    navMain: [
        {
            title: "Tableau de bord",
            url: "/admin",
            icon: IconDashboard,
        },
        {
            title: "Cours & formations",
            url: "/admin/courses",
            icon: IconListDetails,
        },
        {
            title: "Etudiants",
            url: "/admin/students",
            icon: IconUsers,
        },
        {
            title: "Articles",
            url: "/admin/blog",
            icon: IconArticle,
        },
        /*{
            title: "Team",
            url: "#",
            icon: IconUsers,
        }, */
    ],
    navSecondary: [
        {
            title: "Settings",
            url: "#",
            icon: IconSettings,
        },
        {
            title: "Get Help",
            url: "#",
            icon: IconHelp,
        },
        {
            title: "Search",
            url: "#",
            icon: IconSearch,
        },
    ],
    documents: [
        {
            name: "Data Library",
            url: "#",
            icon: IconDatabase,
        },
        {
            name: "Reports",
            url: "#",
            icon: IconReport,
        },
        {
            name: "Word Assistant",
            url: "#",
            icon: IconFileWord,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:p-1.5!"
                        >
                            <Link href="/" className="flex items-center space-x-2 mr-6">
                                <Image src={logo} className="size-9" alt="logo" />
                                {/* <span className="font-bold">PICHA KUBWA</span> */}
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                {/* <NavDocuments items={data.documents} /> */}
                {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    )
}
