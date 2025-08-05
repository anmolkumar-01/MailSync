import React, { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Search, MoreHorizontal, User, Waves, Moon, Star, ChevronDown, UserPlus, X, LogOut } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';


// --- HELPER COMPONENTS & FUNCTIONS ---

// Helper to generate a simple avatar with initials
const Avatar = ({ name }) => (
    <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center font-semibold text-slate-600 text-sm">
        {name.charAt(0).toUpperCase()}
    </div>
);

// Helper to render the correct status badge based on status
const StatusBadge = ({ status }) => {
    const styles = {
        'accepted': { icon: Waves, color: 'text-green-600' },
        'invited': { icon: User, color: 'text-gray-400' },
        'rejected': {icon : X, color: 'text-red-400'},
        'left': {icon : LogOut, color: 'text-red-400'},

        'Active': { icon: Waves, color: 'text-green-600' },
        'Top 10%': { icon: Star, color: 'text-amber-500' },
        'Inactive': { icon: Moon, color: 'text-slate-500' },
        'Lurker': { icon: User, color: 'text-sky-500' },
    };
    const currentStyle = styles[status] || styles['Pending'];
    const Icon = currentStyle.icon;
    return (
        <div className={`flex items-center gap-2 text-sm font-medium ${currentStyle.color}`}>
            <Icon className="h-4 w-4" />
            <span>{status}</span>
        </div>
    );
};

// Helper function for styling the role dropdown buttons
const getRoleButtonClasses = (role) => {
    switch (role) {
        case 'orgAdmin': // Approved style
            return 'bg-green-100 text-green-700 hover:bg-green-200';
        case 'orgMember': // Pending style
            'bg-blue-100 text-blue-700 hover:bg-blue-200';
        default:
            return 'bg-slate-200 text-slate-800 hover:bg-slate-300';
    }
};

const getStatusFilterButtonClasses = (status) => {
    switch (status) {
        
        case 'accepted':
            return 'bg-green-100 text-green-700 hover:bg-green-200';
        case 'invited':
            return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
        case 'rejected':
            return 'bg-red-100 text-red-700 hover:bg-red-200';
        case 'left':
            return 'bg-red-100 text-red-700 hover:bg-red-200';

        case 'Active':
            return 'bg-green-100 text-green-700 hover:bg-green-200';
        case 'Inactive':
            return 'bg-slate-100 text-slate-700 hover:bg-slate-200';
        case 'Pending':
            return 'bg-blue-100 text-blue-700 hover:bg-blue-200';
        case 'Lurker':
            return 'bg-sky-100 text-sky-700 hover:bg-sky-200';
        default: // for 'all'
            return 'bg-slate-200 text-slate-800 hover:bg-slate-300';
    }
};

// --- MAIN MEMBERS VIEW COMPONENT ---

const OrgMembersPage = () => {

    const{
        selectedOrg,
        currentOrgMembers,
        fetchCurrentOrgMembers,
        inviteMember,
        removeMember,
        changeRole,
        triggerNotification
    } = useAppStore();

    const [isInviteMemberDialogOpen, setInviteMemberDialogOpen] = useState(false);
    const [newMemberEmail, setNewMemberEmail] = useState('');
    const [newMemberRole, setNewMemberRole] = useState('orgMember');
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(()=>{
        fetchCurrentOrgMembers(selectedOrg._id)
    },[selectedOrg, currentOrgMembers?.length])

    const handleInviteMember = async() => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if(!newMemberEmail?.trim() || !emailRegex.test(newMemberEmail)){
            triggerNotification("Please provide valid email of the new member", "appError");
            return;
        }
        if (!newMemberRole){
            triggerNotification("Please provide valid role of the new member", "appError")
            return;
        }
        
        await inviteMember({
            orgId: selectedOrg._id,
            email: newMemberEmail,
            role: newMemberRole,
        })
        setNewMemberEmail('');
        setNewMemberRole('orgMember');
        setInviteMemberDialogOpen(false);
    };

    const handleDeleteMember = (memberId) => {
        removeMember({
            orgId: selectedOrg._id,
            memberId
        })
    };

    const handleRoleChange = async(memberId, newRole) => {
        await changeRole({orgId: selectedOrg._id, memberId, role: newRole})
    };

    const filteredMembers = useMemo(() => {
        
        let membersToFilter = currentOrgMembers;

        // 1. Apply Search Query Filter
        if (searchQuery.trim()) {
            const lowercasedQuery = searchQuery.toLowerCase();
            membersToFilter = membersToFilter.filter(member => {
                const nameMatch = member.userId?.fullName.toLowerCase().includes(lowercasedQuery);
                const emailMatch = member.userId?.email.toLowerCase().includes(lowercasedQuery);
                const roleMatch = member.role.toLowerCase().includes(lowercasedQuery);
                return nameMatch || emailMatch || roleMatch;
            });
        }

        // 2. Apply Role Filter (if not 'all')
        if (roleFilter !== 'all') {
            membersToFilter = membersToFilter.filter(member => member.role === roleFilter);
        }

        // 3. Apply Status Filter (if not 'all')
        if (statusFilter !== 'all') {
            // The status is called 'status' in your mock data
            membersToFilter = membersToFilter.filter(member => member.status === statusFilter);
        }

        return membersToFilter;

    // Add the new state variables to the dependency array
    }, [currentOrgMembers, searchQuery, roleFilter, statusFilter]);

    return (
        <Card className="h-full flex flex-col shadow-sm bg-white border-slate-200">

            {/* todo : make it scrollable inside and fixed outside */}
            {/* --- FIXED HEADER --- */}
            <CardHeader className="flex-shrink-0 border-b border-slate-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <CardTitle className="text-2xl font-bold text-slate-800">Members · {currentOrgMembers.length}</CardTitle>
                        <CardDescription>Manage your organization's members.</CardDescription>
                    </div>

                    <Dialog open={isInviteMemberDialogOpen} onOpenChange={setInviteMemberDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Invite Members
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Invite a new member</DialogTitle>
                            <DialogDescription>Enter the email and role for the new member. They will receive an invitation to join.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <Input placeholder="Member's Email" value={newMemberEmail} onChange={(e) => setNewMemberEmail(e.target.value)} />
                            <Select value={newMemberRole} onValueChange={setNewMemberRole}>
                                <SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="orgMember">Member</SelectItem>
                                    <SelectItem value="orgAdmin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setInviteMemberDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleInviteMember}>Invite Member</Button>
                        </DialogFooter>
                    </DialogContent>
                    </Dialog>
                </div>

                <div className="flex items-center gap-2 pt-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                        <Input 
                            placeholder="Search for user, role and etc." 
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* ----------- Filter Dropdowns --- */}
                    <div className="flex items-center gap-2 ml-auto">

                        {/* ---- Filter by roles badge ------ */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                
                                <Button
                                    variant="outline"
                                    className={`
                                        font-medium border-0 rounded-full h-auto text-xs 
                                        flex items-center justify-between w-28 px-2.5 py-1
                                        ${getRoleButtonClasses(roleFilter)}
                                    `}
                                >
                                    <span className="capitalize">{roleFilter === 'all' ? 'All Roles' : (roleFilter === 'orgAdmin' ? 'Admin' : 'Member')}</span>
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
                                <DropdownMenuItem onSelect={() => setRoleFilter('all')}>All Roles</DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => setRoleFilter('orgAdmin')}>Admin</DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => setRoleFilter('orgMember')}>Member</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* ---- Filter by status badge ------ */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={`
                                        font-medium border-0 rounded-full h-auto text-xs 
                                        flex items-center justify-between w-28 px-2.5 py-1
                                        ${getStatusFilterButtonClasses(statusFilter)}
                                    `}
                                >
                                    <span className="capitalize">{statusFilter}</span>
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                                <DropdownMenuItem onSelect={() => setStatusFilter('all')}>All</DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => setStatusFilter('accepted')}>Accepted</DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => setStatusFilter('invited')}>Invited</DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => setStatusFilter('rejected')}>Rejected</DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => setStatusFilter('left')}>Left</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </CardHeader>

            {/* --- SCROLLABLE TABLE CONTENT --- */}
            <CardContent className="flex-1 overflow-y-auto p-0 min-h-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="pl-6">Member</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="hidden md:table-cell">Member since</TableHead>
                            <TableHead className="hidden lg:table-cell">Last activity at</TableHead>
                            <TableHead><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    
                    <TableBody>

                        {filteredMembers.map(member => (
                            <TableRow key={member._id} className="hover:bg-slate-50">
                                <TableCell className="pl-6">
                                    <div className="flex items-center gap-3">
                                        <Avatar name={member.userId?.fullName} />
                                        <div>
                                            <p className="font-medium text-slate-800">{member.userId?.fullName}</p>
                                            <p className="text-sm text-slate-500 hidden sm:block">{member.userId.email}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                
                                <TableCell>
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
                                                    ${getRoleButtonClasses(member.role)}
                                                `}
                                            >
                                                <span className="capitalize">{member.role === 'orgAdmin' ? 'Admin' : 'Member'}</span>
                                                <ChevronDown className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                                            <DropdownMenuItem onSelect={() => handleRoleChange(member._id, 'orgMember')}>Member</DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => handleRoleChange(member._id, 'orgAdmin')}>Admin</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                                
                                <TableCell>
                                    <StatusBadge status={member.status} /> {/* todo: Invite member status field */}
                                </TableCell>
                                
                                <TableCell className="hidden md:table-cell text-slate-600">{new Date(member.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell className="hidden lg:table-cell text-slate-600">{new Date(member.lastActivityAt).toLocaleDateString()}</TableCell>
                                
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem
                                                onSelect={() => handleDeleteMember(member._id)}
                                                className="text-red-500 focus:text-red-600 focus:bg-red-50"
                                            >
                                                Remove Member
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

export default OrgMembersPage;