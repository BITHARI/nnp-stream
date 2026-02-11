'use client'

import {
    BookOpenIcon,
    ChevronDownIcon,
    Home,
    LayoutDashboardIcon,
    LogOutIcon
} from "lucide-react"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import useSignout from "@/hooks/use-signout"

interface UserDropdownProps {
    user: any
}

export default function UserDropdown({ user }: UserDropdownProps) {
    const { signoutPending, handleSignout } = useSignout()
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-fit p-1.5 hover:bg-transparent">
                    <Avatar>
                        <AvatarImage src={user?.image} alt="Profile image" />
                        <AvatarFallback className="border-2 border-primary flex items-center justify-center text-center">{user?.name?.split(' ').slice(0, 2).map((name: string) => name.charAt(0)).join('')}</AvatarFallback>
                    </Avatar>
                    <ChevronDownIcon
                        size={16}
                        className="opacity-60"
                        aria-hidden="true"
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-w-64">
                <DropdownMenuLabel className="flex min-w-0 flex-col">
                    <span className="text-foreground truncate text-sm font-medium">
                        {user?.name}
                    </span>
                    <span className="text-muted-foreground truncate text-xs font-normal">
                        {user.email}
                    </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignout}>
                    {signoutPending
                        ? <span>Déconnexion...</span>
                        : <>
                            <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
                            <span>Se déconnecter</span>
                        </>}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
