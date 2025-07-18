import { useState} from "react";
import { useAppStore } from "../../store/useAppStore";
import { Checkbox } from "../ui/checkbox";
import { ScrollArea } from "../ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Input } from "../ui/input";
import { Search, Pencil } from "lucide-react";
import {Button, FileIconManual, AddEmailModal} from '..'

const SelectRecipients = () => {
  const { uploadedFileName, setUploadedFileName, clearRecipients, extractedEmails, selectedEmails, setSelectedEmails } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false)

  // console.log("Selected emails are : ", selectedEmails);
  
  // filtered =  searched emails if serached else all extracted ones
  const filteredEmails = extractedEmails.filter((email) =>
    email.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  const allFilteredSelected =
    filteredEmails.length > 0 &&
    filteredEmails.every((email) => selectedEmails.includes(email));

  const toggleEmail = (email) => {
    setSelectedEmails(
      selectedEmails.includes(email)
        ? selectedEmails.filter((e) => e !== email)
        : [...selectedEmails, email]
    );
  };

  const toggleSelectAllFiltered = () => {
    if (allFilteredSelected) {
      setSelectedEmails(selectedEmails.filter(email => !filteredEmails.includes(email)));
    } else {
      setSelectedEmails([...new Set([...selectedEmails, ...filteredEmails])]);
    }
  };


  // for the file icon component
  const handleRemoveFile = () => {
    setUploadedFileName(null);
    clearRecipients(); 

  };

  return (

    <Card className="shadow-md border-blue-100 gap-3">
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle className="flex items-center gap-3 text-xl">
            <span className="flex items-center justify-center w-8 h-8 text-sm font-bold rounded-full bg-blue-500 text-white">2</span>
            <span className="text-blue-900">Select Recipients</span>
          </CardTitle>
          
          {/* showing the currently uploaded file */}
          {uploadedFileName && 
            <FileIconManual 
              name={uploadedFileName}
              onRemove={handleRemoveFile}
            />
          }
        </div>
        <CardDescription className="text-gray-600">Select the users you wish to email</CardDescription>
      </CardHeader>
      
      <CardContent>

        <div className="flex items-center gap-2 mb-2">

          {extractedEmails.length > 0 ? (

            // Search Input Container 
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search recipients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full border-blue-200 focus:border-blue-500"
              />
            </div>
           
          ) : (
            <div className="flex-1" />
          )}
        
          {/* Add New Email Button */}
          <Button
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white hover:bg-white hover:text-blue-500 hover:border hover:border-blue-300"
          >
            <Pencil className="mr-1.5 h-3.5 w-3.5" />
            Add New
          </Button>
          
        </div>

        {/* Add new email modal */}
        <AddEmailModal 
          isOpen={isModalOpen} 
          onOpenChange={setIsModalOpen} 
        />

        <div className=" border rounded-lg bg-white border-blue-100">
          {extractedEmails.length > 0 ? (
            <>
              {/* --------- Select all -----------*/}
              <div className="p-3 border-b border-blue-100 bg-blue-50/50 flex items-center justify-between gap-3">
                
                {/* checkbox */}
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="select-all"
                    checked={allFilteredSelected}
                    onCheckedChange={toggleSelectAllFiltered}
                    disabled={filteredEmails.length === 0}
                    className="data-[state=checked]:bg-blue-500 data-[state=checked]:text-white data-[state=checked]:border-blue-500"
                  />
                  <label htmlFor="select-all" className="text-sm font-medium text-blue-800 leading-none cursor-pointer">
                    Select All {filteredEmails.length > 0 ? `(${filteredEmails.length})` : ''}
                  </label>
                </div>

                {/* number of selected */}
                <div className="text-xs font-semibold text-blue-600">
                  {selectedEmails.length} / {extractedEmails.length} selected
                </div>
              </div>

              {/* -------- show filtered( searched something ? searched emails : all extracted emails) emails--------- */}
              <ScrollArea className="h-46">
                <div className="p-1">
                  {filteredEmails.length > 0 ? (
                    filteredEmails.map((email, index) => (
                      
                      <div
                        key={index}
                        className="flex items-center gap-4 p-2.5 rounded-md hover:bg-blue-50/80 transition-colors"
                      >
                      <Checkbox
                        id={`email-${index}`}
                        checked={selectedEmails.includes(email)}
                        onCheckedChange={() => toggleEmail(email)}
                        className="data-[state=checked]:bg-blue-500 data-[state=checked]:text-white data-[state=checked]:border-blue-500"
                      />
                        <label htmlFor={`email-${index}`} className="text-sm font-mono text-gray-600 cursor-pointer flex-1">
                          {email}
                        </label>
                      </div>
                    
                  ))
                  ) : (
                    <div className="flex items-center justify-center h-40 text-sm text-gray-500">
                      <p>No emails match your search.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>

            </>
          ) : (
            <div className="flex items-center justify-center h-46 text-sm text-gray-500">
              <p>{uploadedFileName? "No email addresses found.": "Upload a file to see extracted emails here."}</p>
            </div>
          )}
        </div>

      </CardContent>
      

    </Card>
  );
};

export default SelectRecipients;