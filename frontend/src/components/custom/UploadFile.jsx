import { useState, useRef } from "react";
import { UploadCloud } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";

function UploadFile() {
  const { uploadFile, uploadedFileName, setUploadedFileName, triggerNotification, clearRecipients } = useAppStore();
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target?.files?.[0];

    if(uploadedFileName){
      clearRecipients();
    }

    if (!file){
      triggerNotification("No file selected. Please upload a file", "notify");
      return;
    }

    // console.log("file uploaded in frontend : ", file);

    const acceptedExtensions = ['.txt', '.pdf', '.docx', '.xls', '.xlsx', '.csv'];
    const fileExtension = `.${file.name.split('.').pop().toLowerCase()}`;

    if (!acceptedExtensions.includes(fileExtension)) {
      triggerNotification("Unsupported file format. Accepted formats include: .txt, .pdf, .docx, .xls, .xlsx, .csv", "error");
      return;
    }

    setUploadedFileName(file.name);
    
    const formData = new FormData();
    formData.append("emailData", file);

    // console.log("file sending in uploadFile in frontend : ", file);

    await uploadFile(formData);

    if(fileInputRef.current){
      fileInputRef.current.value = null;
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(false);

    const files = e.dataTransfer?.files;

    if (files && files.length > 0) {
      const fileListEvent = { target: { files: files } };
      handleFileChange(fileListEvent);
    }
  };


  return (
    <Card className="shadow-md border-blue-100">

      {/* upload file text */}
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl">
          <span className="flex items-center justify-center w-8 h-8 text-sm font-bold rounded-full bg-blue-500 text-white">1</span>
          <span className="text-blue-900">Upload File</span>
        </CardTitle>
        <CardDescription className="text-gray-600">Upload a file to automatically extract emails</CardDescription>
      </CardHeader>

      <CardContent>
        {/* input section */}
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileChange}
          accept=".txt,.pdf,.docx,.xls,.xlsx,.csv"
          ref={fileInputRef}
        />

        <label
          htmlFor="file-upload"
          className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-lg cursor-pointer transition-colors
            ${isDragging ? "border-blue-500 bg-blue-50" : "border-blue-200 hover:border-blue-400 hover:bg-blue-50/80"}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <UploadCloud className="w-10 h-10 text-blue-400 mb-2" />
          <p className="text-sm font-semibold text-blue-700">
            {isDragging ? "Drop the file here" : "Click or drag file to upload"}
          </p>
          <p className="text-xs text-gray-500">Supported formats: .txt, .pdf, .docx, .xls, .xlsx, .csv</p>
        </label>
      </CardContent>
            
        
    </Card>
  );
}

export default UploadFile;