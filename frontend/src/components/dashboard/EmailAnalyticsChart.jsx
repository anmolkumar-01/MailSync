'use client'; // Required for charts

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
// 👇 The crucial change: We import and use AreaChart instead of LineChart
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useAppStore } from '@/store/useAppStore';

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

    const {fetchWeeklyEmailAnalytics, weeklyEmailAnalytics, selectedOrg} = useAppStore()
    const [thisWeek, setThisWeek] = useState([]);
    const [allWeeks, setAllWeeks] = useState([]);

    useEffect(() => {
        const loadAnalytics = async () => {
            const data = await fetchWeeklyEmailAnalytics({ orgId: selectedOrg._id });
            setThisWeek(data?.thisWeek || []);
            setAllWeeks(data?.allWeeks || []);
        };
        loadAnalytics();
    }, [selectedOrg]);

    const weekdayNames = {
        1: 'Sunday',
        2: 'Monday',
        3: 'Tuesday',
        4: 'Wednesday',
        5: 'Thursday',
        6: 'Friday',
        7: 'Saturday'
    };
    const thisWeekMap = Object.fromEntries(thisWeek.map(d => [d._id, d.count]));
    const allWeeksMap = Object.fromEntries(allWeeks.map(d => [d._id, d.avgCount]));

    // Build chartData for all days (Sunday → Saturday)
    const chartData = Object.keys(weekdayNames).map(dayNum => ({
    day: weekdayNames[dayNum],
    thisWeek: thisWeekMap[dayNum] || 0,
    average: allWeeksMap[dayNum] || 0
    }));

    // console.log(chartData);
    
    return (
        <Card className=" h-full flex flex-col shadow-sm border-slate-200">
            <CardHeader>
                <CardTitle className="font-bold text-lg text-slate-900">Email Analytics</CardTitle>
                <CardDescription className="text-slate-600">
                    Your daily emails sent compared to your weekly average.
                </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 min-h-0">
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