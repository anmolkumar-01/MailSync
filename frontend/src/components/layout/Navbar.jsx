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
import { GoogleIcon, UserIcon } from '..';

const Navbar = () => {
    const { currentUser, signin} = useAppStore();

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

            {/* --------- User icon(if logged in else signin with google) ---------- */}
            <div className="flex items-center">
                {currentUser ? (
                <UserIcon />
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