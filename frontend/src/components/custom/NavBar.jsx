import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { LogIn, LogOut, Mail, ChevronDown } from 'lucide-react';
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

const NavBar = () => {
  const { user, signin, logout } = useAppStore();

  const handleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse) => {

      console.log("Google login code response: ", codeResponse);
      await signin({ code: codeResponse.code }); 
    },
    onError: () => console.log("Google login failed"),
    scope: [
        'openid',
        'email',
        'profile',
        'https://www.googleapis.com/auth/gmail.send'
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
      .map(part => part[0])
      .slice(0, 1)
      .join('')
      .toUpperCase();
  };

  return (
    // Header styled with the explicit blue theme
    <header className="flex items-center justify-between p-3 px-6 border-b bg-blue-50/50 border-blue-200">
      
      {/* --------- Logo ---------- */}
      <div className="flex items-center gap-3 text-xl font-semibold text-blue-900">
        <div className="p-2 rounded-lg">
            <img 
              src="https://cdn-icons-png.flaticon.com/512/893/893257.png" 
              alt="MailSync" 
              className="w-7 h-7 object-contain" 
            />
        </div>
        <span>MailSync</span>
      </div>

      <div className="flex items-center gap-4">

        {user ? (
          // --- avatar with dropdown ---
          <DropdownMenu>

            {/* -------- Avatar */}
            <DropdownMenuTrigger asChild>

              <Button variant="ghost" className="flex items-center gap-2 px-2 py-1 h-auto rounded-full hover:bg-blue-100/80">  
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.picture} alt={user.fullName} />

                  {/* -------- if image is not present */}
                  <AvatarFallback className="bg-blue-200 text-blue-800 font-bold">
                    {getInitials(user.fullName)}
                  </AvatarFallback>
                  
                </Avatar>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </Button>

            </DropdownMenuTrigger>
            
            {/* ---- Dropdown  , todo : add switch account button*/}
            <DropdownMenuContent align="end" className="w-56 border-blue-200">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-blue-900">{user.fullName}</p>
                  <p className="text-xs leading-none text-gray-500">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              
              <DropdownMenuSeparator className="bg-blue-100" />
              
              <DropdownMenuItem 
                onClick={handleLogout} 
                className="cursor-pointer text-blue-800 focus:bg-blue-100 focus:text-blue-900"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        ) : (
          // --- Manual signin button ---
          <Button 
            size="sm"
            onClick={() => handleLogin()} 
            className="text-blue-600 border-blue-200 bg-blue-100 hover:bg-blue-500 hover:text-white">
            <LogIn className="mr-2 h-4 w-4" /> 
            Sign In
          </Button>

        )}
      </div>
    </header>
  );
};

export default NavBar;