import { Upload } from "lucide-react";


function UploadFile() {
  const handleFileChange = () => {}

  return (
    <div className="bg-card w-full rounded-md shadow-md border p-4 text-card-foreground">
      <div className="flex flex-col justify-between items-center gap-6 ">

        {/* Text Left */}
        <div className="w-full space-y-2">
            <div className="flex items-center gap-2">
                <Upload className="w-6 h-6 text-foreground" />
                <h2 className="text-2xl font-semibold text-foreground">STEP 1: Upload File</h2>
            </div>
        </div>

        {/* File Upload Right */}
        <div className="w-full flex justify-center">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="file-upload"
            className="shadow-inner-md w-full h-40 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-input rounded-xl px-4 py-6 bg-background text-muted-foreground cursor-pointer hover:border-ring transition"
          >
            <Upload className="w-8 h-8 text-muted-foreground" />
            <p className="text-sm font-medium">Click to upload your file</p>
            <p className="text-xs text-muted-foreground">Supported: .csv, .xlsx</p>
          </label>
        </div>

      </div>
    </div>
  )
}

export default UploadFile;
