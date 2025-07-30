import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import {ChevronDown} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MOCK_ACTIVITIES } from '..'

// Initial state data to match the visual examples
const INITIAL_ACTIVITIES = MOCK_ACTIVITIES.map((activity, index) => ({
    ...activity,
    status: index === 0 ? 'Approved' : (index === 1 ? 'Approved' : (index === 2 ? 'Rejected' : 'Pending'))
}));

// Helper function to get styles for the button, making it look like a badge
const getStatusButtonClasses = (status) => {
    switch (status) {
        case 'Approved':
            return 'bg-green-100 text-green-700 hover:bg-green-200';
        case 'Rejected':
            return 'bg-red-100 text-red-700 hover:bg-red-200';
        case 'Pending':
        default:
            return 'bg-blue-100 text-blue-700 hover:bg-blue-200';
    }
};

const ActivityTable = () => {
    const [activities, setActivities] = useState(INITIAL_ACTIVITIES);

    const handleStatusChange = (activityId, newStatus) => {
        setActivities(currentActivities =>
            currentActivities.map(activity =>
                activity.id === activityId ? { ...activity, status: newStatus } : activity
            )
        );
    };

    return (
        <Card className="shadow-sm bg-white h-full flex flex-col">
            <CardHeader className="px-7 flex-shrink-0">
                <CardTitle className="text-slate-800">Order Activities</CardTitle>
                <CardDescription>Keep track of recent order activities.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto px-7">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Restaurant Name</TableHead>
                            <TableHead className="hidden sm:table-cell">Customer Name</TableHead>
                            <TableHead className="hidden md:table-cell">Date & Time</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {activities.map(activity => (
                            <TableRow key={activity.id} className="hover:bg-slate-50">
                                <TableCell><div className="font-medium text-slate-700">{activity.id}</div></TableCell>
                                <TableCell><div className="font-medium text-slate-700">{activity.restaurant}</div></TableCell>
                                <TableCell className="hidden sm:table-cell text-slate-600">{activity.customer}</TableCell>
                                <TableCell className="hidden md:table-cell text-slate-600">{activity.date}</TableCell>
                                <TableCell className="text-right text-slate-700">{activity.amount}</TableCell>
                                <TableCell className="flex justify-center items-center">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            {/* 
                                              👇 FINAL VERSION 👇
                                              - Fixed width (`w-28`) for uniform size.
                                              - `justify-between` aligns text and icon to the edges.
                                              - `ChevronDown` icon added for clear affordance.
                                            */}
                                            <Button
                                                variant="outline"
                                                className={`
                                                    font-medium border-0 rounded-full h-auto text-xs 
                                                    transition-colors focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-slate-400
                                                    flex items-center justify-between
                                                    w-28
                                                    px-2.5 py-1
                                                    ${getStatusButtonClasses(activity.status)}
                                                `}
                                            >
                                                <span className="capitalize">{activity.status}</span>
                                                <ChevronDown className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                                            <DropdownMenuItem onSelect={() => handleStatusChange(activity.id, 'Pending')}>
                                                Pending
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => handleStatusChange(activity.id, 'Approved')}>
                                                Approved
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => handleStatusChange(activity.id, 'Rejected')}>
                                                Rejected
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default ActivityTable