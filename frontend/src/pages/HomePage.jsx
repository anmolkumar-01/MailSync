import { ComposeAndSend, NavBar, SelectRecipients, UploadFile } from "../components"


function HomePage() {


  return (

    <div className="w-full p-2">
      
      <div className="px-4 mx-auto">
        <NavBar />
      </div>

      <div className="w-full bg-background space-y-6">
        
        <div className="flex flex-col lg:flex-row gap-6 px-4 mx-auto">

          {/* Left Column */}
          <div className="flex flex-col gap-6 w-full lg:w-1/2">
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

export default HomePage