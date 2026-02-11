'use client'

import { IconBook, IconShoppingCart, IconUsers } from "@tabler/icons-react"
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { AxiosResponse } from "axios"
import { getDashCardData } from "@/services/admin-dash"
import { useEffect } from "react"
import { toast } from "sonner"

export default function SectionCards() {
    const { data, isLoading } = useQuery<AxiosResponse<{
        users: number,
        enrolledUsers: number,
        publishedCourses: number,
        totalCourses: number
    }>>({
        queryKey: ['admin-cards-data'],
        queryFn: getDashCardData
    })
    const dashboardCardsData = data?.data

    useEffect(() => {
        if (isLoading) toast.loading("Chargement des données")
        else toast.dismiss()
    }, [isLoading])
    return (
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">

            <Card className="@container/card">
                <CardHeader className="flex items-start justify-between pb-2">
                    <div>
                        <CardDescription>Utilisateurs enregistrés</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            {dashboardCardsData?.users || 0}
                        </CardTitle>
                    </div>
                    <IconUsers className="size-6" />
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <p className="text-muted-foreground">Utilisateurs enregistrés sur la plateforme</p>
                </CardFooter>
            </Card>

            <Card className="@container/card">
                <CardHeader className="flex items-start justify-between pb-2">
                    <div>
                        <CardDescription>Étudiants inscrits</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            {dashboardCardsData?.enrolledUsers || 0}
                        </CardTitle>
                    </div>
                    <IconShoppingCart className="size-6" />
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <p className="text-muted-foreground">Etudiants inscrits à au moins une formation</p>
                </CardFooter>
            </Card>

            <Card className="@container/card">
                <CardHeader className="flex items-start justify-between pb-2">
                    <div>
                        <CardDescription>Formations publiées</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            {dashboardCardsData?.publishedCourses || 0}
                        </CardTitle>
                    </div>
                    <IconBook className="size-6" />
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <p className="text-muted-foreground">Cours disponibles pour inscription</p>
                </CardFooter>
            </Card>

            <Card className="@container/card">
                <CardHeader className="flex items-start justify-between pb-2">
                    <div>
                        <CardDescription>Cours enregistrés</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            {dashboardCardsData?.totalCourses || 0}
                        </CardTitle>
                    </div>
                    <IconBook className="size-6" />
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <p className="text-muted-foreground">Tous les cours enregistrés sur la plateforme</p>
                </CardFooter>
            </Card>

        </div>
    )
}
