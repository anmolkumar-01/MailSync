import {Link} from 'react-router'
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { LogOut, ChevronDown, Home, Building2, LayoutDashboard } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
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
import { GoogleIcon } from '..';

const Navbar = () => {
    const { currentUser, signin, logout } = useAppStore();

    const handleLogin = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: async (codeResponse) => {
            console.log('Google login code response: ', codeResponse);
            await signin({ code: codeResponse.code });
        },
        onError: () => console.log('Google login failed'),
        scope: [
            'openid',
            'email',
            'profile',
            'https://www.googleapis.com/auth/gmail.send',
        ].join(' '),
        access_type: 'offline',
        prompt: 'consent',
    });

    const handleLogout = () => {
        googleLogout();
        logout();
    };

    const getInitials = (name = '') => {
        return name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 1)
        .join('')
        .toUpperCase();
    };

    //- Navigations links for authenticated users
    const userNavLinks = [
        { name: 'Home', href: '/', icon: <Home className="h-4 w-4 text-sky-500" /> },
        { name: 'Organization', href: '/organization', icon: <Building2 className="h-4 w-4 text-violet-500" /> },
        { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="h-4 w-4 text-amber-500" /> },
    ];

    //- Navigations links for guest users
    const guestNavLinks = [
        { name: 'Home', href: '/', icon: <Home className="h-4 w-4 text-sky-500" /> },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-3 px-8 bg-blue-50/50 backdrop-blur-md shadow-sm border-b border-slate-200">
        
        {/* --------- Logo ---------- */}
        <Link to="/" className="flex items-center gap-3 text-xl font-semibold text-slate-900">
            <img
            src="./logo.png"
            alt="MailSync"
            className="w-8 h-8 object-contain"
            />
            <span className='hidden sm:block'>MailSync</span>
        </Link>

        {/* --------- Right side: Links + Auth status ---------- */}
        <div className="flex items-center gap-4">

            {/* --------- Navigation Links ---------- */}
            <nav className="flex items-center gap-2">
                {(currentUser ? userNavLinks : guestNavLinks).map((link) => (
                    <a
                        key={link.name}
                        href={link.href}
                        className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md hover:bg-slate-100 transition-colors"
                    >
                        {link.icon}
                        <span className="hidden sm:block">{link.name}</span>
                    </a>
                ))}
            </nav>

            {/* --------- Auth Status ---------- */}
            <div className="flex items-center">
                {currentUser ? (
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
                ) : (
                <Button
                    size="sm"
                    onClick={handleLogin}
                    className="text-gray-600 border-blue-200 bg-blue-100 hover:bg-indigo-400 hover:text-white"
                >
                <GoogleIcon className="mr-2" />
                    Sign in with Google
                </Button>
                )}
            </div>
        </div>
        </header>
    );
};

export default Navbar;