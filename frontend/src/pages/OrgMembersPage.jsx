import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Search, MoreHorizontal, User, Waves, Moon, Star, ChevronDown, UserPlus } from 'lucide-react';

// --- MOCK DATA (self-contained for this component) ---
const MOCK_MEMBERS = [
    { id: 1, name: 'hype.eth', email: 'hype@example.com', role: 'orgAdmin', activity: 'Active', memberSince: 'May 20th, 2021', lastActivity: '4 hours ago' },
    { id: 2, name: 'calbear.eth', email: 'calbear@example.com', role: 'orgMember', activity: 'Inactive', memberSince: 'April 29th, 2020', lastActivity: '2 days ago' },
    { id: 3, name: 'larrydart', email: 'larry@example.com', role: 'orgMember', activity: 'Lurker', memberSince: 'November 3rd, 2021', lastActivity: '1 month ago' },
    { id: 4, name: 'spaceman', email: 'space@example.com', role: 'orgAdmin', activity: 'Top 10%', memberSince: 'January 20th, 2019', lastActivity: '7 hours ago' },
    { id: 5, name: 'tojo', email: 'tojo@example.com', role: 'orgMember', activity: 'Active', memberSince: 'January 1st, 2020', lastActivity: '1 day ago' },
    { id: 6, name: 'remnynt', email: 'rem@example.com', role: 'orgMember', activity: 'Active', memberSince: 'October 17th, 2022', lastActivity: '14 hours ago' },
];

// --- HELPER COMPONENTS & FUNCTIONS ---

// Helper to generate a simple avatar with initials
const Avatar = ({ name }) => (
    <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center font-semibold text-slate-600 text-sm">
        {name.charAt(0).toUpperCase()}
    </div>
);

// Helper to render the correct activity badge based on status
const ActivityBadge = ({ activity }) => {
    const styles = {
        'Active': { icon: Waves, color: 'text-green-600' },
        'Top 10%': { icon: Star, color: 'text-amber-500' },
        'Inactive': { icon: Moon, color: 'text-slate-500' },
        'Lurker': { icon: User, color: 'text-sky-500' },
        'Pending': { icon: User, color: 'text-gray-400' },
    };
    const currentStyle = styles[activity] || styles['Pending'];
    const Icon = currentStyle.icon;
    return (
        <div className={`flex items-center gap-2 text-sm font-medium ${currentStyle.color}`}>
            <Icon className="h-4 w-4" />
            <span>{activity}</span>
        </div>
    );
};

// Helper function for styling the role dropdown buttons
const getRoleButtonClasses = (role) => {
    switch (role) {
        case 'orgAdmin': // Approved style
            return 'bg-green-100 text-green-700 hover:bg-green-200';
        case 'orgMember': // Pending style
        default:
            return 'bg-blue-100 text-blue-700 hover:bg-blue-200';
    }
};

// --- MAIN MEMBERS VIEW COMPONENT ---

const OrgMembersPage = () => {
    const [members, setMembers] = useState(MOCK_MEMBERS);
    const [isAddMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
    const [newMemberEmail, setNewMemberEmail] = useState('');
    const [newMemberRole, setNewMemberRole] = useState('orgMember');

    const handleInviteMember = () => {
        if (!newMemberEmail) return;
        const newMember = {
            id: Date.now(),
            name: newMemberEmail.split('@')[0], // Simple name generation
            email: newMemberEmail,
            role: newMemberRole,
            activity: 'Pending',
            memberSince: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            lastActivity: 'Never',
        };
        setMembers([newMember, ...members]);
        setNewMemberEmail('');
        setNewMemberRole('orgMember');
        setAddMemberDialogOpen(false);
    };

    const handleDeleteMember = (memberId) => {
        setMembers(members.filter(m => m.id !== memberId));
    };

    const handleRoleChange = (memberId, newRole) => {
        setMembers(members.map(m => m.id === memberId ? { ...m, role: newRole } : m));
    };

    return (
        <Card className="h-full flex flex-col shadow-sm bg-white border-slate-200">
            {/* --- FIXED HEADER --- */}
            <CardHeader className="flex-shrink-0 border-b border-slate-200">
                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <CardTitle className="text-2xl font-bold text-slate-800">Members · {members.length}</CardTitle>
                        <CardDescription>Manage your organization's members.</CardDescription>
                    </div>
                     <Dialog open={isAddMemberDialogOpen} onOpenChange={setAddMemberDialogOpen}>
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
                                <Button variant="outline" onClick={() => setAddMemberDialogOpen(false)}>Cancel</Button>
                                <Button onClick={handleInviteMember}>Invite Member</Button>
                            </DialogFooter>
                        </DialogContent>
                     </Dialog>
                </div>
                <div className="flex items-center gap-2 pt-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                        <Input placeholder="Search for user, role and etc." className="pl-8" />
                    </div>
                    <Button variant="outline">Roles</Button>
                    <Button variant="outline">Activity level</Button>
                </div>
            </CardHeader>

            {/* --- SCROLLABLE TABLE CONTENT --- */}
            <CardContent className="flex-1 overflow-y-auto p-0 min-h-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="pl-6">Member</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Activity Level</TableHead>
                            <TableHead className="hidden md:table-cell">Member since</TableHead>
                            <TableHead className="hidden lg:table-cell">Last activity at</TableHead>
                            <TableHead><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {members.map(member => (
                            <TableRow key={member.id} className="hover:bg-slate-50">
                                <TableCell className="pl-6">
                                    <div className="flex items-center gap-3">
                                        <Avatar name={member.name} />
                                        <div>
                                            <p className="font-medium text-slate-800">{member.name}</p>
                                            <p className="text-sm text-slate-500 hidden sm:block">{member.email}</p>
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
                                            <DropdownMenuItem onSelect={() => handleRoleChange(member.id, 'orgMember')}>Member</DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => handleRoleChange(member.id, 'orgAdmin')}>Admin</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                                <TableCell>
                                    <ActivityBadge activity={member.activity} />
                                </TableCell>
                                <TableCell className="hidden md:table-cell text-slate-600">{member.memberSince}</TableCell>
                                <TableCell className="hidden lg:table-cell text-slate-600">{member.lastActivity}</TableCell>
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
                                                onSelect={() => handleDeleteMember(member.id)}
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