import { useState } from "react"
import { Button } from ".."
import { useAppStore } from "../../store/useAppStore";
import { useGoogleLogin } from '@react-oauth/google';
import { googleLogout } from '@react-oauth/google';

function NavBar() {


    const {user, signin, logout} = useAppStore();

    const manualGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: {
                    Authorization: `Bearer ${tokenResponse.access_token}`,
                },
            });

            const userInfo = await res.json();
            console.log("Manual login success:", userInfo);
            signin({fullName: userInfo.name, email: userInfo.email})
        },
        onError: () => console.log("Manual Login failed"),
    })

    const handleAuth = () => {

        if(user){
            logout();
            googleLogout();
        }
        else manualGoogleLogin();
    }


  return (

   <header className="w-full my-3 py-3 px-4 lg:px-10 rounded-md shadow-md border text-card-foreground bg-card flex justify-between items-center">
        {/* Left: Logo */}
        <div className="flex items-center gap-3 text-lg font-semibold tracking-tight">
            <img
                src="./icon.png"
                alt="MailSync logo"
                className="w-6 h-6 rounded-sm object-cover"
            />
            <span>MailSync</span>
        </div>


        {/* Right: Auth Button */}
        <Button  onClick={()=> handleAuth()}>
            {user? "Logout" : "Sign in with Google"}
        </Button>
    </header>

  )
}

export default NavBar