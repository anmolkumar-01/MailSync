import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {ChevronDown} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MOCK_ACTIVITIES } from '..'
import { useAppStore } from '@/store/useAppStore';
import { getPlanStyles, truncateName, getStatusButtonClasses  } from '@/lib/helperFxns';

// Initial state data to match the visual examples
const INITIAL_ACTIVITIES = MOCK_ACTIVITIES.map((activity, index) => ({
    ...activity,
    status: index === 0 ? 'Approved' : (index === 1 ? 'Approved' : (index === 2 ? 'Rejected' : 'Pending'))
}));

const AdminOrgsTable = () => {

    const {
        adminOrgs,
        adminUpdateOrgStatus
    } = useAppStore()

    const handleStatusChange = async(orgId, newStatus) => {
        await adminUpdateOrgStatus({orgId, status: newStatus})
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
                            <TableHead>Organization</TableHead>
                            <TableHead className="hidden sm:table-cell">Owner</TableHead>
                            <TableHead className="hidden md:table-cell">Created At</TableHead>
                            <TableHead className="text-right">Tier</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    
                    <TableBody>
                        {adminOrgs.map(org => {
                            // console.log(org)
                            const planStyles = getPlanStyles(org.tier);
                        return (                            
                            <TableRow key={org._id} className="hover:bg-slate-50">
                                <TableCell><div className="font-medium text-slate-700">{truncateName(org.name, 20)}</div></TableCell>
                                <TableCell className="hidden sm:table-cell text-slate-600">{org.email}</TableCell>
                                <TableCell className="hidden md:table-cell text-slate-600">{new Date(org.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell  className="text-right"> <Badge variant="outline" className={`font-semibold border-2 ${planStyles.badge}`}>{org.tier}</Badge></TableCell>
                                
                                <TableCell className="flex justify-center items-center">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={`
                                                    font-medium border-0 rounded-full h-auto text-xs 
                                                    transition-colors focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-slate-400
                                                    flex items-center justify-between
                                                    w-28
                                                    px-2.5 py-1
                                                    ${getStatusButtonClasses(org.status)}
                                                `}
                                            >
                                                <span className="capitalize">{org.status}</span>
                                                <ChevronDown className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                                            <DropdownMenuItem onSelect={() => handleStatusChange(org._id, 'pending')}>
                                                Pending
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => handleStatusChange(org._id, 'approved')}>
                                                Approved
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => handleStatusChange(org._id, 'rejected')}>
                                                Rejected
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                    )})}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default AdminOrgsTable