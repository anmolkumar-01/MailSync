import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../ui/button';
import { LogIn, LogOut, Mail } from 'lucide-react';

function NavBar() {
  const { user, signin, logout } = useAppStore();

  const manualGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });
        const userInfo = await res.json();
        signin({ fullName: userInfo.name, email: userInfo.email });
      } catch (error) {
        console.error("Manual Login failed:", error);
      }
    },
    onError: () => console.log("Manual Login failed"),
  });

  const handleAuth = () => {
    if (user) {
      logout();
      googleLogout();
    } else {
      manualGoogleLogin();
    }
  };

  return (
    <header className="flex items-center justify-between p-4 px-6 border-b bg-blue-50/50">
      <div className="flex items-center gap-3 text-xl font-semibold text-blue-900">
        <div className="p-2 bg-blue-500 rounded-lg">
           <Mail className="w-5 h-5 text-white" />
        </div>
        <span>MailSync</span>
      </div>
      <div className="flex items-center gap-4">
        {user && <span className="text-sm text-gray-600 hidden sm:inline">Welcome, {user.fullName}</span>}
        <Button onClick={handleAuth} variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-100 hover:text-blue-700">
          {user ? <><LogOut className="mr-2 h-4 w-4" /> Logout</> : <><LogIn className="mr-2 h-4 w-4" /> Sign In</>}
        </Button>
      </div>
    </header>
  );
}

export default NavBar;