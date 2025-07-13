import { AutoGoogleLogin, NavBar, SelectRecipients, UploadFile, ComposeAndSend } from "../components";
import { useAppStore } from "../store/useAppStore";

function HomePage() {
  const { user } = useAppStore();

  return (
    <div className="min-h-screen bg-secondary">
      <AutoGoogleLogin />
      <NavBar />

      <main className="p-4 sm:p-6 lg:p-8">
        {user ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
            {/* Left Column */}
            <div className="flex flex-col gap-8">
              <UploadFile />
              <SelectRecipients />
            </div>

            {/* Right Column */}
            <div className="w-full">
              <ComposeAndSend />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center h-[70vh] bg-card rounded-lg border">
              <h1 className="text-2xl font-bold tracking-tight">Welcome to MailSync</h1>
              <p className="text-muted-foreground mt-2">Please sign in with Google to begin.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export { HomePage };