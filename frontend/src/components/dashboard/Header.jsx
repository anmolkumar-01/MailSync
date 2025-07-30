import { Bell, ChevronDown, CircleUser } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MOCK_USERS } from '..';

const Header = ({ dashboardTitle, currentUser, setCurrentUser, handleBackToUserDashboard }) => (
    <header className="flex h-[60px] items-center gap-4 border-b border-slate-200 bg-white px-6">
        <div className="w-full flex-1">
            <h1 className="text-xl font-semibold text-slate-800">{dashboardTitle}</h1>
        </div>

        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="text-slate-600">
                    Switch User <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => { setCurrentUser(MOCK_USERS.appAdmin); handleBackToUserDashboard(); }}>App Admin</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setCurrentUser(MOCK_USERS.orgAdmin); handleBackToUserDashboard(); }}>Org Admin</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setCurrentUser(MOCK_USERS.orgMember); handleBackToUserDashboard(); }}>Org Member</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" className="rounded-full text-slate-500">
            <Bell className="h-5 w-5" />
        </Button>

        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <CircleUser className="h-5 w-5 text-slate-500" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>{currentUser.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </header>
);

export default Header