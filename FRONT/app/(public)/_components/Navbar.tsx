'use client'

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import UserDropdown from "./UserDropdown";
import { useAuth } from "@/providers/AuthProvider";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, AnimatedMenuIcon } from "@/components/ui/navigation-menu";
import NnpLogo from "@/components/icons/NnpLogo";
import NnpMinifiedLogo from "@/components/icons/NnpMinifiedLogo";
import SearchBar from "@/components/search/SearchBar";
import HeartIcon from "@/components/icons/HeartIcon";
import { usePathname } from "next/navigation";
import LiveIcon from "@/components/icons/LiveIcon";
import { Heart, User2 } from "lucide-react";
import { useMemo, useEffect, useState } from "react";

export default function Navbar() {
    const { user, isAdmin } = useAuth()
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        setToken(localStorage.getItem("nnp-stream-token"));
    }, []);

    const navigationItems = useMemo(() => {
        return [
            { name: "Studio", href: `${process.env.NEXT_PUBLIC_ADMIN_URL}?t=${token || ''}`, target: "_blank", icon: <LiveIcon />, enabled: isAdmin },
            { name: "Favoris", href: "/favorites", icon: <Heart />, enabled: !!user?.id },
        ]
    }, [token])

    const pathname = usePathname()

    return <header className="fixed w-full top-0 z-50 bg-linear-to-b from-nnp-primary to-transparent pb-4">
        <div className="container flex min-h-16 items-center justify-between gap-4 mx-auto px-4 md:px-6 lg:px-8">
            <div className="hidden lg:flex items-center -ml-1.5">
                <Link href="/" className="hover:opacity-9 transition-opacity">
                    <NnpLogo />
                </Link>
            </div>
            <Link href="/" className="lg:hidden relative hover:opacity-90 transition-opacity">
                <NnpMinifiedLogo />
            </Link>
            <SearchBar />
            <nav className="flex items-center gap-2">
                <div className="hidden lg:flex items-center gap-2">
                    {navigationItems.map((link, index) => {
                        if (!link.enabled) return null;
                        return <Link
                            key={index}
                            href={link.href}
                            target={link.target}
                            data-active={pathname.toLowerCase().startsWith(link.href.toLowerCase())}
                            className="group flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-all"
                        >
                            {link.icon}
                            <span className="text-nnp-muted group-data-[active=true]:text-nnp-highlight group-data-[active=true]:font-bold transition-all">
                                {link.name}
                            </span>
                        </Link>
                    })}
                </div>
                <div className={`flex items-center space-x-4 ${!user && "max-md:hidden"}`}>
                    {user
                        ? <UserDropdown user={user} />
                        : <div className="hidden md:block">
                            <Link href="/login" className={buttonVariants({ variant: "outline" })}><User2 className="size-4" /></Link>
                        </div>
                    }
                </div>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            className="group size-8 lg:hidden"
                            variant="ghost"
                            size="icon"
                        >
                            <AnimatedMenuIcon />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-36 p-1 md:hidden">
                        <NavigationMenu className="max-w-none *:w-full">
                            <NavigationMenuList className="flex-col items-start gap-0 md:gap-2 space-y-1">
                                {navigationItems.map((link, index) => {
                                    if (!link.enabled) return null;
                                    return <NavigationMenuItem key={index} className="w-full">
                                        <NavigationMenuLink href={link.href} target={link.target} className="py-1.5">
                                            <div className="flex items-center justify-between gap-2">
                                                <span>{link.name}</span>
                                                {link.icon}
                                            </div>
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>
                                })}
                                {!user && <NavigationMenuItem className="w-full">
                                    <Link href="/login" className={buttonVariants({ className: 'w-full' })}>Se connecter</Link>
                                </NavigationMenuItem>}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </PopoverContent>
                </Popover>
            </nav>
        </div>
    </header>
}