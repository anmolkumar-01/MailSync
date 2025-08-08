'use client'; // Required for charts

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
// 👇 The crucial change: We import and use AreaChart instead of LineChart
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

// --- MOCK DATA (Unchanged) ---
const chartData = [
    { day: 'Monday', thisWeek: 50, average: 90 },
    { day: 'Tuesday', thisWeek: 20, average: 28 },
    { day: 'Wednesday', thisWeek: 30, average: 35 },
    { day: 'Thursday', thisWeek: 40, average: 42 },
    { day: 'Friday', thisWeek: 60, average: 48 },
    { day: 'Saturday', thisWeek: 55, average: 52 },
    { day: 'Sunday', thisWeek: 85, average: 55 },
];

// --- CHART CONFIGURATION (Unchanged) ---
const chartConfig = {
    thisWeek: {
        label: 'This Week',
        color: 'hsl(221.2 83.2% 53.3%)', // A vibrant blue
    },
    average: {
        label: 'Average',
        color: 'hsl(215.4 51.3% 62.5%)', // A softer, lighter blue
    },
};

// --- MAIN CHART COMPONENT ---
export const EmailAnalyticsChart = () => {
    return (
        <Card className="shadow-sm border-slate-200">
            <CardHeader>
                <CardTitle className="font-bold text-lg text-slate-900">Email Analytics</CardTitle>
                <CardDescription className="text-slate-600">
                    Your daily emails sent compared to your weekly average.
                </CardDescription>
            </CardHeader>
            
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    {/* 👇 Using the correct AreaChart wrapper component */}
                    <AreaChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            top: 5,
                            right: 10,
                            left: 15,
                            bottom: 0,
                        }}
                    >
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis
                            dataKey="day"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={{ strokeDasharray: '3 3' }}
                            content={<ChartTooltipContent indicator="dot" />}
                        />
                        
                        {/* Gradient definitions for the fills */}
                        <defs>
                            <linearGradient id="fillThisWeek" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-thisWeek)" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="var(--color-thisWeek)" stopOpacity={0.1} />
                            </linearGradient>
                            <linearGradient id="fillAverage" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-average)" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="var(--color-average)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        
                        {/* The "Average" Area is rendered first to be in the background */}
                        <Area
                            type="monotone"
                            dataKey="average"
                            stroke="var(--color-average)"
                            fill="url(#fillAverage)"
                            fillOpacity={1}
                            strokeWidth={2}
                            dot={{
                                r: 2.5,
                                fill: "var(--color-average)",
                            }}
                            activeDot={{
                                r: 4
                            }}
                        />
                        
                        {/* The "This Week" Area is rendered second to be in the foreground */}
                        <Area
                            type="monotone"
                            dataKey="thisWeek"
                            stroke="var(--color-thisWeek)"
                            fill="url(#fillThisWeek)"
                            fillOpacity={1}
                            strokeWidth={2.5}
                            dot={{
                                r: 2.5,
                                fill: "var(--color-thisWeek)",
                            }}
                            activeDot={{
                                r: 4,
                                stroke: 'hsl(var(--background))',
                            }}
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};

export default EmailAnalyticsChart;