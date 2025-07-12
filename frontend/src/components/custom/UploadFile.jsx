import { Upload } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { useState } from "react";

function UploadFile() {

    let {error, uploadFile} = useAppStore()
    const [isDragging, setIsDragging] = useState(false);


    // file is dropped
    const handleDrop = (e) => {
      e.preventDefault();   // prevent opening file in another tab
      setIsDragging(false);

      const files = e.dataTransfer?.files;
      // console.log("Drag and dropped file ", files);

      const fileListEvent = {target:{files:files}}
      handleFileChange(fileListEvent)
      
    }

    // calling file upload api
    const handleFileChange = async (e) => {

        const file = e.target?.files[0];
        if(!file) return;

        const acceptedExtensions = ['.txt', '.pdf', '.docx', '.xls', '.xlsx', '.csv'];

        const fileExtension = file.name.split('.').pop().toLowerCase();

        if (!acceptedExtensions.includes(`.${fileExtension}`)) {
        error = "Unsupported file format. Please upload .txt, .pdf, .docx, .xls, .xlsx, or .csv";
        return;
        }

        error = ''
        const formData = new FormData();
        formData.append("emailData",file);

        // console.log("File to be sent", e.target.files[0])
        await uploadFile(formData);
    }

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
            className={`w-full h-40 flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl px-4 py-6 bg-background text-muted-foreground cursor-pointer transition hover:border-ring
            ${isDragging ? "border-ring bg-accent/30" : "border-input shadow-inner-md"}
            `}

            onDragOver={(e) => {e.preventDefault(); setIsDragging(true);}}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
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
