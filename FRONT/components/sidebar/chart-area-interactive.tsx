"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { useQuery } from "@tanstack/react-query"
import { getEnrollmentsChartData } from "@/services/admin-dash"
import { useMemo } from "react"
import { AxiosResponse } from "axios"

export const description = "An interactive area chart"

const lastNinetyDays: { date: string, enrollments: number }[] = [];

for (let i = 89; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    lastNinetyDays.push({
        date: date.toISOString().split("T")[0],
        enrollments: 0
    });
}

const chartConfig = {
    enrollements: {
        label: "Inscriptions",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

export function ChartAreaInteractive() {
    const { data, isLoading } = useQuery<AxiosResponse<{ date: string, enrollments: number }[]>>({
        queryKey: ["enrollments"],
        queryFn: getEnrollmentsChartData,
    })

    const chartData = data?.data || lastNinetyDays

    const total = useMemo(() => {
        return chartData.reduce((acc, item) => acc + item.enrollments, 0)
    }, [isLoading])
    return (
        <Card className="@container/card">
            <CardHeader>
                <CardTitle>Inscriptions aux formations</CardTitle>
                <CardDescription>
                    <span className="hidden @[540px]/card:block">Nombre total d'inscriptions aux formations pour les 3 derniers mois: {total}</span>
                    <span className="@[540px]/card:hidden">3 derniers mois : {total}</span>
                </CardDescription>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <BarChart margin={{ left: 12, right: 12 }} data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            interval={'preserveStartEnd'}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("fr-FR", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent className="w-[150px]"
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("fr-FR", {
                                            month: "short",
                                            day: "numeric",
                                        })
                                    }}
                                    indicator="dot"
                                />
                            }
                        />
                        <Bar dataKey="enrollments" fill="var(--color-chart-1)" />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
