import {NotificationContainer, NavBar, SelectRecipients, UploadFile, ComposeAndSend, Notification } from "../components";
import { useAppStore } from "../store/useAppStore";
import { Link } from "react-router";

function HomePage() {
  const { user, isSigningIn} = useAppStore();

  return (
    <>
      <div className="min-h-screen bg-secondary">
        <NavBar />

        <main className="p-4 sm:p-6 lg:p-4">

            <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-4 space-y-8 lg:space-y-0">
              
              {/* Left Column */}
              <div className="flex flex-col gap-4">
                <UploadFile />
                <SelectRecipients />
              </div>

              {/* Right Column */}
              <div className="w-full">
                <ComposeAndSend />
              </div>
              
            </div>



        </main>

        <footer className="p-4 text-center">
          <Link to="/privacy-policy" className="text-sm text-gray-500 hover:underline">
            Privacy Policy
          </Link>
        </footer>

      </div>

      {/* ---------- Notifications --------- */}
      <NotificationContainer />
    </>
  );
}

export { HomePage };