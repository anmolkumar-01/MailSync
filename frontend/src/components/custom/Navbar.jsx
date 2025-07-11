import { useState } from "react"
import { Button } from ".."

function NavBar() {

    const isLoggedIn = false;
    const onAuthClick = () => {}

  return (
     
   <header className="w-full my-3 rounded-md shadow-md border text-card-foreground p-3 bg-card flex justify-between items-center">
        {/* Left: Logo */}
        <div className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <img
                src="./icon.png"
                alt="MailSync logo"
                className="w-6 h-6 rounded-sm object-cover"
            />
            <span>MailSync</span>
        </div>


        {/* Right: Auth Button */}
        <Button  onClick={onAuthClick}>
            {isLoggedIn ? "Logout" : "Sign in with Google"}
        </Button>
    </header>

  )
}

export default NavBar