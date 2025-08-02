import { Bell, ChevronDown, CircleUser } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MOCK_USERS } from '..';

const Header = ({ dashboardTitle, currentUser, handleBackToUserDashboard }) => (
    <header className="flex h-[60px] items-center gap-4 border-b border-slate-200 bg-white px-6">
        <div className="w-full flex-1">
            <h1 className="text-xl font-semibold text-slate-800">{dashboardTitle}</h1>
        </div>

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