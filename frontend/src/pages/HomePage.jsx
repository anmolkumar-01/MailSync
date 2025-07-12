import { ComposeAndSend, NavBar, SelectRecipients, UploadFile } from "../components"
import {AutoGoogleLogin} from "../components"


function HomePage() {

  return (

    <div className="w-full p-2 ">

      {/* -------- Google automatic login --------*/}
      <AutoGoogleLogin />
      
      {/* -------- Navbar ----------- */}
      <div className="px-4 mx-auto">
        <NavBar />
      </div>


      <div className="w-full bg-background space-y-6">
        
        <div className="flex flex-col lg:flex-row gap-3 px-4 mx-auto">

          {/* Left Column */}
          <div className="flex flex-col gap-3 w-full lg:w-1/2">
            <UploadFile />
            <SelectRecipients />
          </div>

          {/* Right Column */}
          <div className="w-full lg:w-1/2">
            <ComposeAndSend />
          </div>

        </div>

      </div>

    </div>
  )
}

export {HomePage}