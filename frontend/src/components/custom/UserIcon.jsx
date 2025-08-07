import { googleLogout} from '@react-oauth/google';
import { LogOut, ChevronDown} from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useAppStore } from '@/store/useAppStore';

function UserIcon() {

    const {currentUser, logout } = useAppStore()

    const getInitials = (name = '') => {
        return name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 1)
        .join('')
        .toUpperCase();
    };

    const handleLogout = () => {
        googleLogout();
        logout();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button
                variant="ghost"
                className="flex items-center gap-2 px-2 py-1 h-auto rounded-full hover:bg-slate-100"
            >
                <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser.profilePic} alt={currentUser.fullName} />
                    <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">
                        {getInitials(currentUser.fullName)}
                    </AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4 text-slate-500" />
            </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 border-slate-200 mt-2">
            <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-slate-900">{currentUser.fullName}</p>
                <p className="text-xs leading-none text-slate-500">{currentUser.email}</p>
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-100" />
            <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700"
            >
                <LogOut className="text-red-600 mr-2 h-4 w-4" />
                <span>Logout</span>
            </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserIcon