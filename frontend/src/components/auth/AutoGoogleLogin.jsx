import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { useAppStore } from "../../store/useAppStore";

const AutoGoogleLogin = () => {

  const {user, signin} = useAppStore();

  useEffect(() => {

    if(user) return;
    
    window.google?.accounts?.id?.initialize({

      client_id: import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID,
      callback: (res) => {
        
        const decoded = jwtDecode(res.credential);
        console.log("Auto login success:", decoded);

        signin({fullName: decoded.name, email: decoded.email})
        // return decoded;
        // TODO: Save to localStorage or redirect if needed
      },
      auto_select: true,
      cancel_on_tap_outside: false,
    });

    window.google?.accounts?.id?.prompt();
  }, []);

  return null; // No visible UI
};

export default AutoGoogleLogin;